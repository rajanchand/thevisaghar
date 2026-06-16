import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { cleanImageMetadata } from "@/lib/exif-cleaner";
import { promises as fs } from "fs";
import path from "path";

// Allowed upload mime types
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// Sniff file buffer signature to prevent extension spoofing
function verifyFileSignature(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  // PNG: 89 50 4E 47
  if (mime === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }
  // WebP: RIFF ... WEBP (offset 0 has RIFF, offset 8 has WEBP)
  if (mime === "image/webp") {
    const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // "RIFF"
    if (buffer.length < 12) return false;
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50; // "WEBP"
    return isRiff && isWebp;
  }
  // PDF: 25 50 44 46 (%PDF)
  if (mime === "application/pdf") {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  return false;
}

// GET all uploaded media assets
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("[Admin Media GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch media assets list" },
      { status: 500 }
    );
  }
}

// POST upload file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const canWrite = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canWrite) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validate File Size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size boundary of 5MB" },
        { status: 400 }
      );
    }

    // 2. Validate MIME type header
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file format. Only JPEGs, PNGs, WebPs, and PDFs are permitted." },
        { status: 400 }
      );
    }

    // Convert to node Buffer
    const arrayBuffer = await file.arrayBuffer();
    let fileBuffer = Buffer.from(arrayBuffer) as any;

    // 3. Prevent Extension Spoofing via Header Sniffing
    if (!verifyFileSignature(fileBuffer, mimeType)) {
      return NextResponse.json(
        { error: "Security check failed: file contents do not match specified MIME type signature" },
        { status: 400 }
      );
    }

    // 4. Strip EXIF metadata from JPEG / PNG uploads
    fileBuffer = cleanImageMetadata(fileBuffer, mimeType);

    // 5. Save file to public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique slugified filename
    const fileExt = path.extname(file.name) || `.${mimeType.split("/")[1]}`;
    const cleanBaseName = path.basename(file.name, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const uniqueFilename = `${cleanBaseName}-${Date.now()}${fileExt}`;
    const targetFilePath = path.join(uploadsDir, uniqueFilename);
    const publicPath = `/uploads/${uniqueFilename}`;

    // Write file to workspace filesystem
    await fs.writeFile(targetFilePath, fileBuffer);

    // 6. Record asset in Database
    const asset = await prisma.mediaAsset.create({
      data: {
        path: publicPath,
        altText: altText || cleanBaseName.replace(/-/g, " "),
        type: mimeType,
        size: fileBuffer.length,
        uploadedBy: session.user.name,
      },
    });

    // 7. Audit log action
    await logAudit({
      action: "UPLOAD_MEDIA",
      entity: "MediaAsset",
      entityId: asset.id,
      userId: session.user.id,
      details: { path: asset.path, type: asset.type, size: asset.size },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("[Admin Media Upload POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to upload and secure media asset" },
      { status: 500 }
    );
  }
}
