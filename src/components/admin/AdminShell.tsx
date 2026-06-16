import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { Crown, LayoutDashboard, Users, Receipt, BarChart3, Settings, LogOut, ExternalLink, UserCog } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const nav: { to: string; label: string; Icon: typeof Users; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/contestants", label: "Contestants", Icon: Users },
  { to: "/admin/transactions", label: "Transactions", Icon: Receipt },
  { to: "/admin/users", label: "Users", Icon: UserCog },
  { to: "/admin/analytics", label: "Analytics", Icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data: isAdmin, isLoading } = useIsAdmin(user?.id);
  const router = useRouter();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Checking access…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="max-w-md">
          <Crown className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-4 font-display text-3xl">Admin only</h1>
          <p className="mt-2 text-muted-foreground">Sign in with the admin email (admin@muicons.com) to access this dashboard.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild variant="outline"><Link to="/">Home</Link></Button>
            <Button asChild className="gradient-gold text-onyx" onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}>
              <Link to="/auth">Switch account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="hidden gradient-onyx p-4 text-pearl md:flex md:flex-col">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-4">
          <Crown className="h-6 w-6 text-gold" />
          <span className="font-display text-xl">MU Icons</span>
        </Link>
        <nav className="mt-4 flex-1 space-y-1">
          {nav.map(({ to, label, Icon, exact }) => (
            <Link
              key={to} to={to}
              activeOptions={{ exact: !!exact }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-pearl/75 transition hover:bg-pearl/10 hover:text-pearl"
              activeProps={{ className: "bg-pearl/10 text-pearl" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-pearl/10 pt-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-pearl/70 hover:bg-pearl/10">
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-pearl/70 hover:bg-pearl/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="px-3 py-2 text-xs text-pearl/40 truncate">{user?.email}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col bg-background">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <Crown className="h-5 w-5 text-gold" /><span className="font-display text-lg">MU Icons</span>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">Admin Console</div>
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="ghost" size="sm"><Link to="/">View site</Link></Button>
          </div>
        </header>
        {/* Mobile nav */}
        <nav className="border-b bg-card px-2 py-2 md:hidden overflow-x-auto scrollbar-thin">
          <div className="flex gap-1">
            {nav.map(({ to, label, Icon, exact }) => (
              <Link key={to} to={to} activeOptions={{ exact: !!exact }}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </div>
        </nav>
        <main className="flex-1 p-4 md:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
