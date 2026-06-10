import prisma from "@/lib/db";

interface AuditLogParams {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, any>;
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
        details: details || {},
        ipAddress,
      },
    });
  } catch (error) {
    console.error("[Audit Log Error]:", error);
  }
}
