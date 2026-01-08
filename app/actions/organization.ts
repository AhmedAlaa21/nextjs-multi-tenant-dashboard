"use server";

import { updateOrganizationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function updateOrganizationAction(orgId: string, data: unknown) {
  try {
    await requirePermission(orgId, "settings:write");

    const validated = updateOrganizationSchema.parse(data);

    // Check if slug is already taken by another organization
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: validated.slug },
    });

    if (existingOrg && existingOrg.id !== orgId) {
      return { error: "This slug is already taken by another organization" };
    }

    // Update organization
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: validated.name,
        slug: validated.slug,
      },
    });

    revalidatePath(`/${orgId}/settings`);
    return { success: true };
  } catch (error: any) {
    console.error("Update organization error:", error);
    return { error: error.message || "Failed to update organization" };
  }
}
