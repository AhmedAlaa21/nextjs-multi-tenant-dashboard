import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create organizations
  const org1 = await prisma.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corporation",
      slug: "acme-corp",
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { slug: "tech-startup" },
    update: {},
    create: {
      name: "Tech Startup",
      slug: "tech-startup",
    },
  });

  console.log("✅ Created organizations");

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: "owner@acme.com" },
    update: {},
    create: {
      email: "owner@acme.com",
      name: "John Owner",
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@acme.com" },
    update: {},
    create: {
      email: "admin@acme.com",
      name: "Jane Admin",
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "member@acme.com" },
    update: {},
    create: {
      email: "member@acme.com",
      name: "Bob Member",
      password: hashedPassword,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "owner@tech.com" },
    update: {},
    create: {
      email: "owner@tech.com",
      name: "Alice Owner",
      password: hashedPassword,
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: "admin@tech.com" },
    update: {},
    create: {
      email: "admin@tech.com",
      name: "Charlie Admin",
      password: hashedPassword,
    },
  });

  console.log("✅ Created users");

  // Create memberships
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user1.id,
        organizationId: org1.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      organizationId: org1.id,
      role: Role.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user2.id,
        organizationId: org1.id,
      },
    },
    update: {},
    create: {
      userId: user2.id,
      organizationId: org1.id,
      role: Role.ADMIN,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user3.id,
        organizationId: org1.id,
      },
    },
    update: {},
    create: {
      userId: user3.id,
      organizationId: org1.id,
      role: Role.MEMBER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user4.id,
        organizationId: org2.id,
      },
    },
    update: {},
    create: {
      userId: user4.id,
      organizationId: org2.id,
      role: Role.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user5.id,
        organizationId: org2.id,
      },
    },
    update: {},
    create: {
      userId: user5.id,
      organizationId: org2.id,
      role: Role.ADMIN,
    },
  });

  // Create a user that belongs to both organizations
  const user6 = await prisma.user.upsert({
    where: { email: "multi@example.com" },
    update: {},
    create: {
      email: "multi@example.com",
      name: "Multi Tenant User",
      password: hashedPassword,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user6.id,
        organizationId: org1.id,
      },
    },
    update: {},
    create: {
      userId: user6.id,
      organizationId: org1.id,
      role: Role.MEMBER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user6.id,
        organizationId: org2.id,
      },
    },
    update: {},
    create: {
      userId: user6.id,
      organizationId: org2.id,
      role: Role.MEMBER,
    },
  });

  console.log("✅ Created memberships");
  console.log("\n📝 Seed data created successfully!");
  console.log("\nTest accounts:");
  console.log("  - owner@acme.com / password123 (Owner of Acme Corp)");
  console.log("  - admin@acme.com / password123 (Admin of Acme Corp)");
  console.log("  - member@acme.com / password123 (Member of Acme Corp)");
  console.log("  - owner@tech.com / password123 (Owner of Tech Startup)");
  console.log("  - admin@tech.com / password123 (Admin of Tech Startup)");
  console.log("  - multi@example.com / password123 (Member of both orgs)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
