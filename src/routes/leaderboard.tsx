import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Crown, Trophy, Medal, Award } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — MU Icons" },
      { name: "description", content: "Live ranking of the top contestants in the MU Icons pageant." },
      { property: "og:title", content: "Live Leaderboard — MU Icons" },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contestants")
        .select("id, contestant_number, full_name, faculty, image, total_votes")
        .order("total_votes", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    const ch = supabase
      .channel("leaderboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "contestants" }, () => {
        qc.invalidateQueries({ queryKey: ["leaderboard"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);


  const podium = (data ?? []).slice(0, 3);
  const rest = (data ?? []).slice(3);

  const podiumOrder = [1, 0, 2]; // visually: 2nd, 1st, 3rd

  return (
    <PublicLayout>
      <section className="relative overflow-hidden gradient-onyx py-20 text-pearl">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, oklch(0.78 0.13 86 / .4), transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/40 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
            <Crown className="h-3.5 w-3.5" /> Live Standings
          </div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">The Leaderboard</h1>
          <p className="mt-3 text-pearl/80">Updated every 15 seconds. Cast your vote and watch them rise.</p>
        </div>

        {/* Podium */}
        {podium.length >= 1 && (
          <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-3 md:items-end">
            {podiumOrder.map((idx, i) => {
              const c = podium[idx];
              if (!c) return <div key={i} />;
              const place = idx + 1;
              const heights = ["md:mb-8", "md:mb-16", "md:mb-0"];
              const ring = ["ring-pearl", "ring-gold", "ring-rose"][idx];
              const Icon = [Trophy, Crown, Medal][idx];
              return (
                <Link
                  key={c.id} to="/contestants/$id" params={{ id: c.id }}
                  className={`group relative ${heights[i]}`}
                >
                  <div className="rounded-3xl border border-pearl/10 bg-onyx/40 p-5 backdrop-blur transition hover:bg-onyx/60">
                    <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full ring-4 ring-offset-4 ring-offset-onyx" style={{ boxShadow: "0 0 50px oklch(0.78 0.13 86 / .3)" }}>
                      <SignedImage bucket="contestant-photos" path={c.image} alt={c.full_name} className={`h-full w-full object-cover ${ring}`} fallbackClassName="h-full w-full" />
                    </div>
                    <div className="mt-4 text-center">
                      <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${place === 1 ? "gradient-gold text-onyx" : "bg-pearl/10 text-pearl"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-widest text-gold">{["1st Place", "2nd Place", "3rd Place"][idx]}</div>
                      <h3 className="mt-1 font-display text-2xl text-pearl">{c.full_name}</h3>
                      <p className="text-sm text-pearl/60">#{c.contestant_number} · {c.faculty ?? "—"}</p>
                      <div className="mt-3 font-display text-4xl text-gold-shine">{formatNumber(c.total_votes)}</div>
                      <div className="text-xs uppercase tracking-widest text-pearl/60">votes</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Full Ranking</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
        </div>
        <ul className="mt-6 divide-y rounded-2xl border bg-card">
          {rest.map((c, i) => (
            <li key={c.id}>
              <Link to="/contestants/$id" params={{ id: c.id }} className="flex items-center gap-4 px-5 py-4 hover:bg-accent/30">
                <span className="w-8 text-center font-display text-xl text-muted-foreground">{i + 4}</span>
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <SignedImage bucket="contestant-photos" path={c.image} alt={c.full_name} className="h-full w-full object-cover" fallbackClassName="h-full w-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{c.full_name}</div>
                  <div className="truncate text-xs text-muted-foreground">#{c.contestant_number} · {c.faculty ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg">{formatNumber(c.total_votes)}</div>
                  <div className="text-xs text-muted-foreground">votes</div>
                </div>
                <Award className="h-4 w-4 text-gold opacity-0 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
          {rest.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">No more contestants.</li>
          )}
        </ul>
      </section>
    </PublicLayout>
  );
}
