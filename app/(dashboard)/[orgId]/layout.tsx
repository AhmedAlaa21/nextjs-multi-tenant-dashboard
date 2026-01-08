import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const membership = session.user.memberships.find((m) => m.organizationId === orgId);

  if (!membership) {
    const firstOrg = session.user.memberships[0];
    if (firstOrg) {
      redirect(`/${firstOrg.organizationId}/dashboard`);
    }
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar orgId={orgId} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
