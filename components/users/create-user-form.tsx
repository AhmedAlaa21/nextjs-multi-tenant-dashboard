"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createUserAction } from "@/app/actions/users";
import { useRouter } from "next/navigation";

interface CreateUserFormProps {
  orgId: string;
  onSuccess: () => void;
}

export function CreateUserForm({ orgId, onSuccess }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "MEMBER",
    },
  });

  const role = watch("role");

  async function onSubmit(data: CreateUserInput) {
    setIsLoading(true);

    try {
      const result = await createUserAction(orgId, data);

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
        description: "User created successfully",
      });
      router.refresh();
      onSuccess();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setValue("role", value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
