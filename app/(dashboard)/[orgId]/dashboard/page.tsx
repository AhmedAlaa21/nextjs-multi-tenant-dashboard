import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuth } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export const metadata = {
  title: "Dashboard",
  description: "Overview of your organization",
};

export default async function DashboardPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  await requireAuth(orgId);

  // Get organization stats
  const [userCount, organization] = await Promise.all([
    prisma.membership.count({
      where: { organizationId: orgId },
    }),
    prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true, createdAt: true },
    }),
  ]);

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentMemberships = await prisma.membership.count({
    where: {
      organizationId: orgId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your organization.</p>
      </div>

      <DashboardStats userCount={userCount} recentMemberships={recentMemberships} organizationName={organization?.name || ""} />

      <DashboardCharts orgId={orgId} />
    </div>
  );
}
