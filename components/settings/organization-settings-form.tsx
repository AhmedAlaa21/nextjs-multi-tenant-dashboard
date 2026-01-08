"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrganizationSchema, type UpdateOrganizationInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateOrganizationAction } from "@/app/actions/organization";
import { useRouter } from "next/navigation";

interface OrganizationSettingsFormProps {
  orgId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date;
  };
}

export function OrganizationSettingsForm({ orgId, organization }: OrganizationSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
    },
  });

  async function onSubmit(data: UpdateOrganizationInput) {
    setIsLoading(true);

    try {
      const result = await updateOrganizationAction(orgId, data);

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Organization settings updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>Update your organization name and slug.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" type="text" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" type="text" {...register("slug")} />
            <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase, numbers, and hyphens only)</p>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
