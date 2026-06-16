/**
 * Lightweight, pure TypeScript utility to strip EXIF and metadata segments from JPEGs and PNGs.
 * This runs natively in Next.js Server Components and Edge runtime without heavy external binary dependencies.
 */

export function stripJpegExif(buffer: Buffer): Buffer {
  // A JPEG must start with SOI (Start of Image) marker: 0xFFD8
  if (buffer.length < 4 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
    return buffer; // Not a valid JPEG, return unmodified
  }

  const chunks: Buffer[] = [Buffer.from([0xFF, 0xD8])];
  let offset = 2;

  while (offset < buffer.length) {
    // Check for marker prefix
    if (buffer[offset] !== 0xFF) {
      break;
    }

    const marker = buffer[offset + 1];

    // RST markers (0xD0 - 0xD7) and SOI/EOI don't have length bytes
    if (marker === 0xD9) { // EOI (End of Image)
      chunks.push(Buffer.from([0xFF, 0xD9]));
      break;
    }

    if (offset + 4 > buffer.length) {
      break;
    }

    // Read segment length (2 bytes, big-endian)
    const length = (buffer[offset + 2] << 8) + buffer[offset + 3];
    
    // Safety check for malformed segments
    if (offset + 2 + length > buffer.length || length < 2) {
      break;
    }

    // Skip EXIF/Metadata segments:
    // APP1 (0xE1) - EXIF, XMP
    // APP2 (0xE2) - ICC profiles (sometimes kept, but skip to be safe)
    // APP13 (0xED) - Photoshop metadata, IPTC
    // APP14 (0xEE) - Copyright metadata
    // COM (0xFE) - Comment segment
    const isMetadataSegment = [0xE1, 0xE2, 0xED, 0xEE, 0xFE].includes(marker);

    if (!isMetadataSegment) {
      // Keep other segments
      chunks.push(buffer.subarray(offset, offset + 2 + length));
    }

    // Move to next segment
    offset += 2 + length;
  }

  // If we couldn't parse the JPEG correctly, return original buffer
  if (chunks.length <= 1) {
    return buffer;
  }

  return Buffer.concat(chunks);
}

export function stripPngMetadata(buffer: Buffer): Buffer {
  // A PNG must start with signature: 89 50 4E 47 0D 0A 1A 0A
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(signature)) {
    return buffer; // Not a valid PNG, return unmodified
  }

  const chunks: Buffer[] = [signature];
  let offset = 8;

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) {
      break;
    }

    // Read chunk length (4 bytes, big-endian)
    const length = buffer.readUInt32BE(offset);
    
    // Read chunk type (4 bytes)
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");

    if (offset + 12 + length > buffer.length) {
      break;
    }

    // Skip metadata chunks:
    // tEXt, zTXt, iTXt - Text metadata
    // eXIf - EXIF metadata
    // pHYs - Physical pixel dimensions (optional)
    // tIME - Last modification time
    const isMetadataChunk = ["tEXt", "zTXt", "iTXt", "eXIf", "pHYs", "tIME"].includes(type);

    if (!isMetadataChunk) {
      // Keep core chunks (IHDR, PLTE, IDAT, IEND, etc.)
      chunks.push(buffer.subarray(offset, offset + 12 + length));
    }

    offset += 12 + length;
  }

  if (chunks.length <= 1) {
    return buffer;
  }

  return Buffer.concat(chunks);
}

export function cleanImageMetadata(buffer: Buffer, mimeType: string): Buffer {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return stripJpegExif(buffer);
  }
  if (mimeType === "image/png") {
    return stripPngMetadata(buffer);
  }
  return buffer;
}
