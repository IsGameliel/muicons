import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Users, Heart, Clock, CheckCircle2, XCircle, DollarSign, RotateCcw, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const [resettingVotes, setResettingVotes] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: contestants }, contestantSum, pending, approved, rejected, revenueRow] = await Promise.all([
        supabase.from("contestants").select("id", { count: "exact", head: true }),
        supabase.from("contestants").select("total_votes"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "rejected"),
        supabase.from("transactions").select("amount").eq("status", "approved"),
      ]);
      const totalVotes = (contestantSum.data ?? []).reduce((a, b) => a + (b.total_votes ?? 0), 0);
      const revenue = (revenueRow.data ?? []).reduce((a, b) => a + Number(b.amount ?? 0), 0);
      return {
        contestants: contestants ?? 0,
        totalVotes,
        pending: pending.count ?? 0,
        approved: approved.count ?? 0,
        rejected: rejected.count ?? 0,
        revenue,
      };
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ["admin-daily-votes"],
    queryFn: async () => {
      const since = new Date(); since.setDate(since.getDate() - 13);
      const { data } = await supabase
        .from("transactions")
        .select("created_at, number_of_votes, amount, status")
        .eq("status", "approved")
        .gte("created_at", since.toISOString());
      const map = new Map<string, { day: string; votes: number; revenue: number }>();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        map.set(key, { day: d.toLocaleDateString("en", { month: "short", day: "numeric" }), votes: 0, revenue: 0 });
      }
      (data ?? []).forEach((t) => {
        const key = (t.created_at as string).slice(0, 10);
        const e = map.get(key); if (!e) return;
        e.votes += t.number_of_votes ?? 0;
        e.revenue += Number(t.amount ?? 0);
      });
      return Array.from(map.values());
    },
  });

  const { data: topContestants } = useQuery({
    queryKey: ["admin-top-contestants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contestants").select("full_name, total_votes")
        .order("total_votes", { ascending: false }).limit(7);
      return (data ?? []).map((c) => ({ name: c.full_name.split(" ")[0], votes: c.total_votes }));
    },
  });

  const cards = [
    { label: "Contestants", value: formatNumber(stats?.contestants), Icon: Users, tone: "" },
    { label: "Total Votes", value: formatNumber(stats?.totalVotes), Icon: Heart, tone: "" },
    { label: "Pending", value: formatNumber(stats?.pending), Icon: Clock, tone: "text-warning" },
    { label: "Approved", value: formatNumber(stats?.approved), Icon: CheckCircle2, tone: "text-success" },
    { label: "Rejected", value: formatNumber(stats?.rejected), Icon: XCircle, tone: "text-destructive" },
    { label: "Revenue", value: formatNaira(stats?.revenue), Icon: DollarSign, tone: "text-gold" },
  ];

  async function resetVotes() {
    if (!confirm("Reset all contestant vote counts to 0? This cannot be undone.")) return;

    setResettingVotes(true);
    try {
      const { error } = await supabase
        .from("contestants")
        .update({ total_votes: 0 })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast.success("Vote counts reset to 0");
      qc.invalidateQueries();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to reset votes");
    } finally {
      setResettingVotes(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Live overview of the MU Icons pageant.</p>
        </div>
        <Button variant="outline" onClick={resetVotes} disabled={resettingVotes}>
          {resettingVotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          Reset votes
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ label, value, Icon, tone }) => (
          <div key={label} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs uppercase tracking-widest">{label}</span>
              <Icon className={`h-4 w-4 ${tone}`} />
            </div>
            <div className="mt-2 font-display text-2xl">{value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-display text-lg">Votes (last 14 days)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="votes" stroke="oklch(0.78 0.13 86)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-display text-lg">Top contestants</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topContestants ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="votes" fill="oklch(0.72 0.16 12)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
