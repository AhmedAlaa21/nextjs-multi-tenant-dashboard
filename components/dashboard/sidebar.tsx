"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { TenantSwitcher } from "./tenant-switcher";

const navigation = [
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "Users", href: "users", icon: Users },
  { name: "Settings", href: "settings", icon: Settings },
];

export function Sidebar({ orgId }: { orgId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="mr-2 h-6 w-6" />
        <span className="font-semibold">Admin Dashboard</span>
      </div>
      <div className="flex-1 space-y-1 p-4">
        <TenantSwitcher currentOrgId={orgId} />
        <Separator className="my-4" />
        {navigation.map((item) => {
          const href = `/${orgId}/${item.href}`;
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
