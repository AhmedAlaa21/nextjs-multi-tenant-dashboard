import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    memberships?: Array<{
      organizationId: string;
      organizationSlug: string;
      organizationName: string;
      role: Role;
    }>;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      memberships: Array<{
        organizationId: string;
        organizationSlug: string;
        organizationName: string;
        role: Role;
      }>;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    memberships?: Array<{
      organizationId: string;
      organizationSlug: string;
      organizationName: string;
      role: Role;
    }>;
  }
}
