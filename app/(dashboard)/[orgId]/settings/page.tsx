import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { OrganizationSettingsForm } from "@/components/settings/organization-settings-form";

export const metadata = {
  title: "Settings",
  description: "Manage organization settings",
};

export default async function SettingsPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  await requirePermission(orgId, "settings:read");

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      createdAt: true,
    },
  });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your organization settings and preferences.</p>
      </div>
      <OrganizationSettingsForm orgId={orgId} organization={organization} />
    </div>
  );
}
