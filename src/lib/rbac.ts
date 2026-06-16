import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Checks if the current authenticated user has one of the allowed roles.
 * Returns a boolean.
 */
export async function checkRole(allowedRoles: ("ADMIN" | "EDITOR" | "VIEWER")[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return false;
  }
  return true;
}

/**
 * Enforces authentication and role verification.
 * Throws an error if checks fail, making it perfect for Server Actions.
 */
export async function requireRole(allowedRoles: ("ADMIN" | "EDITOR" | "VIEWER")[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function isAdmin(): Promise<boolean> {
  return await checkRole(["ADMIN"]);
}

export async function isEditor(): Promise<boolean> {
  return await checkRole(["ADMIN", "EDITOR"]);
}

export async function isViewer(): Promise<boolean> {
  return await checkRole(["ADMIN", "EDITOR", "VIEWER"]);
}
