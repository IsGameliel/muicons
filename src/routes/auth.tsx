import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, Loader2, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — MU Icons" }] }),
  component: AuthPage,
});

type Status =
  | { kind: "success"; role: "admin" | "user"; email: string }
  | { kind: "error"; message: string }
  | null;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function routeAfterAuth(opts?: { announce?: boolean }) {
    const { data: userData } = await supabase.auth.getUser();
    const { data: roles } = await supabase.from("user_roles").select("role");
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
    const role: "admin" | "user" = isAdmin ? "admin" : "user";
    if (opts?.announce) {
      setStatus({ kind: "success", role, email: userData.user?.email ?? "" });
      toast.success(
        isAdmin ? "Signed in as Admin — redirecting to dashboard" : "Signed in — redirecting",
        { description: userData.user?.email ?? undefined }
      );
      await new Promise((r) => setTimeout(r, 900));
    }
    navigate({ to: isAdmin ? "/admin" : "/" });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterAuth();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    setLoading(true);
    setStatus(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await routeAfterAuth({ announce: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      setStatus({ kind: "error", message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden gradient-onyx p-12 text-pearl md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="h-7 w-7 text-gold" />
          <span className="font-display text-2xl">MU Icons</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl">Crown your favourite.</h2>
          <p className="mt-3 max-w-md text-pearl/70">
            Sign in to manage the MU Icons pageant, approve transactions, and grow the legend.
          </p>
        </div>
        <div className="text-xs text-pearl/40">© {new Date().getFullYear()} MU Icons</div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="md:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <Crown className="h-6 w-6 text-gold" />
              <span className="font-display text-xl">MU Icons</span>
            </Link>
          </div>
          <div>
            <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to continue." : "Use admin@muicons.com to access the admin dashboard."}
            </p>
          </div>

          {status?.kind === "success" && (
            <Alert className="border-gold/40 bg-gold/10">
              {status.role === "admin" ? (
                <ShieldCheck className="h-4 w-4 text-gold" />
              ) : (
                <UserCheck className="h-4 w-4 text-gold" />
              )}
              <AlertTitle>
                {status.role === "admin" ? "Admin access granted" : "Signed in"}
              </AlertTitle>
              <AlertDescription>
                {status.email} · role: <span className="font-semibold">{status.role}</span> — redirecting…
              </AlertDescription>
            </Alert>
          )}
          {status?.kind === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication failed</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label>Full name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button onClick={submit} disabled={loading} className="w-full gradient-gold text-onyx">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>New here? <button className="font-medium text-foreground underline" onClick={() => setMode("signup")}>Create an account</button></>
            ) : (
              <>Already a member? <button className="font-medium text-foreground underline" onClick={() => setMode("signin")}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
