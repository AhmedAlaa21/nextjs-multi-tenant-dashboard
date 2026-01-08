import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const firstOrg = session.user.memberships[0];
    if (firstOrg) {
      redirect(`/${firstOrg.organizationId}/dashboard`);
    }
  }

  return <SignInForm />;
}
