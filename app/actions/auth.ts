"use server";

import { signUpSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function signUpAction(data: unknown) {
  try {
    const validated = signUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Generate slug from organization name
    const slug = validated.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if organization slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return { error: "Organization with this name already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user, organization, and membership in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          password: hashedPassword,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: validated.organizationName,
          slug,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
        },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { error: error.message || "Failed to create account" };
  }
}
