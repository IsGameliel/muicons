import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: Analytics,
});

const COLORS = ["oklch(0.78 0.13 86)", "oklch(0.72 0.16 12)", "oklch(0.14 0.01 30)", "oklch(0.6 0.12 30)", "oklch(0.55 0.18 280)"];

function Analytics() {
  const tx = useQuery({
    queryKey: ["analytics-tx"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions")
        .select("amount, number_of_votes, status, created_at, contestant_id")
        .eq("status", "approved");
      return data ?? [];
    },
  });

  const contestants = useQuery({
    queryKey: ["analytics-contestants"],
    queryFn: async () => {
      const { data } = await supabase.from("contestants").select("id, full_name, total_votes")
        .order("total_votes", { ascending: false });
      return data ?? [];
    },
  });

  const now = new Date();
  const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);

  const sum = (xs: typeof tx.data, since?: Date) =>
    (xs ?? []).filter((x) => !since || new Date(x.created_at) >= since)
      .reduce((a, b) => a + Number(b.amount ?? 0), 0);

  const totals = {
    revenue: sum(tx.data),
    today: sum(tx.data, dayStart),
    week: sum(tx.data, weekStart),
    month: sum(tx.data, monthStart),
    votes: (tx.data ?? []).reduce((a, b) => a + (b.number_of_votes ?? 0), 0),
  };

  const daily = (() => {
    const map = new Map<string, { day: string; votes: number; revenue: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      map.set(k, { day: d.toLocaleDateString("en", { month: "short", day: "numeric" }), votes: 0, revenue: 0 });
    }
    (tx.data ?? []).forEach((t) => {
      const k = (t.created_at as string).slice(0, 10);
      const e = map.get(k); if (!e) return;
      e.votes += t.number_of_votes ?? 0;
      e.revenue += Number(t.amount ?? 0);
    });
    return Array.from(map.values());
  })();

  const topPie = (contestants.data ?? []).slice(0, 5).map((c) => ({
    name: c.full_name.split(" ")[0], value: c.total_votes,
  }));

  const cards = [
    { label: "Total Revenue", value: formatNaira(totals.revenue) },
    { label: "Today", value: formatNaira(totals.today) },
    { label: "This Week", value: formatNaira(totals.week) },
    { label: "This Month", value: formatNaira(totals.month) },
    { label: "Total Votes", value: formatNumber(totals.votes) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Analytics</h1>
        <p className="text-sm text-muted-foreground">Revenue, votes, and performance breakdowns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="mt-2 font-display text-2xl">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Revenue (30 days)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="oklch(0.72 0.16 12)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Daily Votes">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="votes" fill="oklch(0.78 0.13 86)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top 5 share">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topPie} dataKey="value" nameKey="name" outerRadius={100} label>
                {topPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Votes per contestant">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(contestants.data ?? []).slice(0, 10).map((c) => ({ name: c.full_name.split(" ")[0], votes: c.total_votes }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 80)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="votes" fill="oklch(0.72 0.16 12)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-display text-lg">{title}</h3>
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}
