import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { promises as fs } from "fs";
import path from "path";

type Params = Promise<{ id: string }>;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const canDelete = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Fetch the asset
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    // Delete the file from the filesystem if it exists
    const uploadsDir = path.join(process.cwd(), "public");
    const filePath = path.join(uploadsDir, asset.path);

    try {
      await fs.unlink(filePath);
    } catch (fsErr) {
      console.warn(`[Admin Media DELETE Warning] Could not delete file at ${filePath}:`, fsErr);
      // Proceed with db deletion in case file was already removed manually
    }

    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id },
    });

    // Log audit event
    await logAudit({
      action: "DELETE_MEDIA",
      entity: "MediaAsset",
      entityId: asset.id,
      userId: session.user.id,
      details: { path: asset.path, altText: asset.altText },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Media DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
