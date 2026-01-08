import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const firstOrg = session.user.memberships[0];
    if (firstOrg) {
      redirect(`/${firstOrg.organizationId}/dashboard`);
    }
  }

  return <SignUpForm />;
}
