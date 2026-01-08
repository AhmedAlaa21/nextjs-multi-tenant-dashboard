"use server";

import { createUserSchema, updateUserSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { requirePermission, ensureTenantAccess } from "@/lib/rbac";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUserAction(orgId: string, data: unknown) {
  try {
    await requirePermission(orgId, "users:write");

    const validated = createUserSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      // Check if user is already a member
      const existingMembership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: existingUser.id,
            organizationId: orgId,
          },
        },
      });

      if (existingMembership) {
        return { error: "User is already a member of this organization" };
      }

      // Add existing user to organization
      await prisma.membership.create({
        data: {
          userId: existingUser.id,
          organizationId: orgId,
          role: validated.role,
        },
      });

      revalidatePath(`/${orgId}/users`);
      return { success: true };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create new user and membership
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          password: hashedPassword,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: orgId,
          role: validated.role,
        },
      });
    });

    revalidatePath(`/${orgId}/users`);
    return { success: true };
  } catch (error: any) {
    console.error("Create user error:", error);
    return { error: error.message || "Failed to create user" };
  }
}

export async function updateUserAction(orgId: string, userId: string, data: unknown) {
  try {
    await requirePermission(orgId, "users:write");
    await ensureTenantAccess(orgId, userId);

    const validated = updateUserSchema.parse(data);

    // Update user
    if (validated.name !== undefined || validated.email !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(validated.name !== undefined && { name: validated.name }),
          ...(validated.email !== undefined && { email: validated.email }),
        },
      });
    }

    // Update membership role
    if (validated.role !== undefined) {
      await prisma.membership.update({
        where: {
          userId_organizationId: {
            userId,
            organizationId: orgId,
          },
        },
        data: {
          role: validated.role,
        },
      });
    }

    revalidatePath(`/${orgId}/users`);
    return { success: true };
  } catch (error: any) {
    console.error("Update user error:", error);
    return { error: error.message || "Failed to update user" };
  }
}

export async function deleteUserAction(orgId: string, userId: string) {
  try {
    await requirePermission(orgId, "users:delete");
    await ensureTenantAccess(orgId, userId);

    // Get membership to check role
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership) {
      return { error: "User is not a member of this organization" };
    }

    // Prevent deleting the last OWNER
    if (membership.role === "OWNER") {
      const ownerCount = await prisma.membership.count({
        where: {
          organizationId: orgId,
          role: "OWNER",
        },
      });

      if (ownerCount <= 1) {
        return { error: "Cannot delete the last owner of the organization" };
      }
    }

    // Remove membership (not deleting the user, just removing from org)
    await prisma.membership.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });

    revalidatePath(`/${orgId}/users`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { error: error.message || "Failed to delete user" };
  }
}
