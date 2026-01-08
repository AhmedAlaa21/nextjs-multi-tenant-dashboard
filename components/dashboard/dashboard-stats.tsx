import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Building2 } from "lucide-react";

interface DashboardStatsProps {
  userCount: number;
  recentMemberships: number;
  organizationName: string;
}

export function DashboardStats({ userCount, recentMemberships, organizationName }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: userCount,
      description: "Members in your organization",
      icon: Users,
    },
    {
      title: "New Members",
      value: recentMemberships,
      description: "Joined in the last 7 days",
      icon: UserPlus,
    },
    {
      title: "Organization",
      value: organizationName,
      description: "Your organization name",
      icon: Building2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
