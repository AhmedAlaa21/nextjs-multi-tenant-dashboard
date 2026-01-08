import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export type Permission = "users:read" | "users:write" | "users:delete" | "settings:read" | "settings:write";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: ["users:read", "users:write", "users:delete", "settings:read", "settings:write"],
  ADMIN: ["users:read", "users:write", "settings:read"],
  MEMBER: ["users:read", "settings:read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export async function getCurrentUserMembership(organizationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }

  const membership = session.user.memberships.find((m) => m.organizationId === organizationId);
  return membership || null;
}

export async function requireAuth(organizationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const membership = session.user.memberships.find((m) => m.organizationId === organizationId);
  if (!membership) {
    throw new Error("Forbidden: Not a member of this organization");
  }

  return { session, membership };
}

export async function requirePermission(organizationId: string, permission: Permission) {
  const { membership } = await requireAuth(organizationId);

  if (!hasPermission(membership.role, permission)) {
    throw new Error(`Forbidden: Missing permission ${permission}`);
  }

  return { membership };
}

export async function ensureTenantAccess(organizationId: string, userId?: string) {
  const { membership } = await requireAuth(organizationId);

  // If checking access to a specific user, ensure they belong to the same organization
  if (userId) {
    const userMembership = await prisma.membership.findFirst({
      where: {
        userId,
        organizationId,
      },
    });

    if (!userMembership) {
      throw new Error("Forbidden: User does not belong to this organization");
    }
  }

  return { membership };
}
