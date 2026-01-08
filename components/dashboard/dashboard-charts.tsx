import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MembershipChart } from "./membership-chart";

interface DashboardChartsProps {
  orgId: string;
}

export async function DashboardCharts({ orgId }: DashboardChartsProps) {
  // Get membership data for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const memberships = await prisma.membership.findMany({
    where: {
      organizationId: orgId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date
  const dataByDate = memberships.reduce((acc, membership) => {
    const date = new Date(membership.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create chart data
  const chartData = Object.entries(dataByDate).map(([date, count]) => ({
    date,
    members: count,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Membership Growth</CardTitle>
          <CardDescription>New members over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <MembershipChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
