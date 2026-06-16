import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Shield, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

type AppRole = "admin" | "user";
type AdminUser = {
  user_id: string;
  email: string;
  full_name: string;
  role: AppRole;
  created_at: string;
  last_sign_in_at: string | null;
};

function AdminUsers() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) throw error;
      return (data ?? []) as AdminUser[];
    },
  });

  const users = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];

    return (data ?? []).filter((user) =>
      user.email.toLowerCase().includes(term) ||
      user.full_name.toLowerCase().includes(term) ||
      user.role.includes(term)
    );
  }, [data, q]);

  async function changeRole(user: AdminUser, role: AppRole) {
    if (user.role === role) return;

    setSavingUserId(user.user_id);
    try {
      const { error } = await supabase.rpc("admin_set_user_role", {
        _user_id: user.user_id,
        _role: role,
      });

      if (error) throw error;

      toast.success(`${user.email} is now ${role}`);
      qc.invalidateQueries();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not update role");
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Users</h1>
          <p className="text-sm text-muted-foreground">Manage admin access and user roles.</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          Admin only
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9" />
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Last sign in</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Loading...</td>
              </tr>
            )}
            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No users found.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-accent/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <UserCog className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{user.full_name || "Unnamed user"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role}
                    onValueChange={(value) => changeRole(user, value as AppRole)}
                    disabled={savingUserId !== null}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {savingUserId === user.user_id && (
                    <div className="mt-1 text-xs text-muted-foreground">Saving...</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(user.created_at)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
