"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateUserForm } from "./create-user-form";
import { UpdateUserForm } from "./update-user-form";
import { DeleteUserDialog } from "./delete-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
}

interface UsersTableProps {
  orgId: string;
  users: User[];
}

const roleColors: Record<Role, string> = {
  OWNER: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  ADMIN: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  MEMBER: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

export function UsersTable({ orgId, users }: UsersTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organization Members</CardTitle>
            <CardDescription>A list of all members in your organization.</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account and add them to your organization.</DialogDescription>
              </DialogHeader>
              <CreateUserForm orgId={orgId} onSuccess={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setUpdateUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {updateUser && (
        <Dialog open={!!updateUser} onOpenChange={(open) => !open && setUpdateUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
              <DialogDescription>Update user information and role.</DialogDescription>
            </DialogHeader>
            <UpdateUserForm orgId={orgId} user={updateUser} onSuccess={() => setUpdateUser(null)} />
          </DialogContent>
        </Dialog>
      )}

      {deleteUser && (
        <DeleteUserDialog orgId={orgId} user={deleteUser} onSuccess={() => setDeleteUser(null)} onCancel={() => setDeleteUser(null)} />
      )}
    </Card>
  );
}
