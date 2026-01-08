import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/users/users-table";

export const metadata = {
  title: "Users",
  description: "Manage organization users",
};

export default async function UsersPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  await requirePermission(orgId, "users:read");

  const users = await prisma.user.findMany({
    where: {
      memberships: {
        some: {
          organizationId: orgId,
        },
      },
    },
    include: {
      memberships: {
        where: {
          organizationId: orgId,
        },
        select: {
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const usersWithRoles = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.memberships[0]?.role || "MEMBER",
    createdAt: user.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage users and their roles in your organization.</p>
      </div>
      <UsersTable orgId={orgId} users={usersWithRoles} />
    </div>
  );
}
