"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteUserAction } from "@/app/actions/users";
import { useRouter } from "next/navigation";

interface DeleteUserDialogProps {
  orgId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteUserDialog({ orgId, user, onSuccess, onCancel }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    setIsLoading(true);

    try {
      const result = await deleteUserAction(orgId, user.id);

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
        description: "User deleted successfully",
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
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{user.name || user.email}</strong> from your organization? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
