import { Link } from "@tanstack/react-router";
import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/contestants", label: "Contestants" },
  // { to: "/leaderboard", label: "Leaderboard" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin(user?.id);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-gold" strokeWidth={1.5} />
          <span className="font-display text-xl font-semibold tracking-tight">
            MU <span className="text-gold-shine">Icons</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gold hover:text-rose">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="gradient-gold text-onyx hover:opacity-90">
            <Link to="/contestants">Vote Now</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-2 px-4 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-base font-medium"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-gold">
                Admin
              </Link>
            )}
            <div className="flex gap-2 pt-2">
              {user ? (
                <Button variant="ghost" className="flex-1" onClick={() => supabase.auth.signOut()}>
                  Sign out
                </Button>
              ) : (
                <Button asChild variant="ghost" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
              )}
              <Button asChild className="flex-1 gradient-gold text-onyx">
                <Link to="/contestants" onClick={() => setOpen(false)}>Vote</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
