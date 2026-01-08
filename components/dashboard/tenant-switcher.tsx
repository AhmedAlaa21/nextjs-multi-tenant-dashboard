"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TenantSwitcher({ currentOrgId }: { currentOrgId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const currentOrg = session?.user?.memberships?.find((m) => m.organizationId === currentOrgId);
  const otherOrgs = session?.user?.memberships?.filter((m) => m.organizationId !== currentOrgId) || [];

  if (!currentOrg) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{currentOrg.organizationName}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${currentOrg.organizationId}/dashboard`)}
          className={cn("flex items-center justify-between", currentOrgId === currentOrg.organizationId && "bg-accent")}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{currentOrg.organizationName}</span>
          </div>
          {currentOrgId === currentOrg.organizationId && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        {otherOrgs.map((org) => (
          <DropdownMenuItem
            key={org.organizationId}
            onClick={() => router.push(`/${org.organizationId}/dashboard`)}
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            <span className="truncate">{org.organizationName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
