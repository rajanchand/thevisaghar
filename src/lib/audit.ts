import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

interface AuditLogParams {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit({
  action,
  entity,
  entityId,
  userId,
  details,
  ipAddress,
}: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        details: details as Prisma.InputJsonValue,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("[Audit Log Error]:", error);
  }
}
