"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MembershipChartProps {
  data: Array<{ date: string; members: number }>;
}

export function MembershipChart({ data }: MembershipChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px)",
          }}
        />
        <Area type="monotone" dataKey="members" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMembers)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
