import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Trophy, Sparkles, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { ContestantCard, type Contestant } from "@/components/ContestantCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber } from "@/lib/format";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MU Icons — University Beauty Pageant" },
      { name: "description", content: "Cast your vote for the next MU Icon. Premium beauty pageant voting platform with live leaderboard." },
      { property: "og:title", content: "MU Icons — Crown Your Favourite" },
      { property: "og:description", content: "Live voting, real-time leaderboard, premium pageant experience." },
    ],
  }),
  component: HomePage,
});

function useFeatured() {
  return useQuery({
    queryKey: ["featured-contestants"],
    queryFn: async (): Promise<Contestant[]> => {
      const { data, error } = await supabase
        .from("contestants")
        .select("id, contestant_number, full_name, faculty, image, top_rank, total_votes")
        .eq("status", "active")
        .order("total_votes", { ascending: false });

      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("contestants")
          .select("id, contestant_number, full_name, faculty, image, total_votes")
          .eq("status", "active")
          .order("total_votes", { ascending: false });

        if (fallbackError) throw fallbackError;
        return fallbackData ?? [];
      }

      return data ?? [];
    },
  });
}

function useStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const { data } = await supabase.rpc("public_stats");
      return data?.[0] ?? { total_contestants: 0, total_votes: 0, total_voters: 0 };
    },
  });
}

function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });
}

function HomePage() {
  const featured = useFeatured();
  const stats = useStats();
  const settings = useSettings();
  const contestants = featured.data ?? [];
  const rankedTop3 = [1, 2, 3]
    .map((rank) => contestants.find((c) => c.top_rank === rank))
    .filter((c): c is Contestant => Boolean(c));
  const top3 = [
    ...rankedTop3,
    ...contestants.filter((c) => !rankedTop3.some((ranked) => ranked.id === c.id)),
  ].slice(0, 3);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover object-top opacity-90" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx/85 via-onyx/55 to-onyx/30" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
          <div className="max-w-2xl text-pearl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Season 2026 · Now Voting
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              {settings.data?.competition_name ?? "MU Icons"}
              <span className="mt-2 block text-gold-shine">Beauty Pageant</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pearl/85">
              The crown is decided by you. Vote for your favourite contestant and shape the legacy of this year's MU Icon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-gold text-onyx hover:opacity-90">
                <Link to="/contestants">
                  View Contestants <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {/* <Button asChild size="lg" variant="outline" className="border-pearl/30 bg-pearl/10 text-pearl hover:bg-pearl/20">
                <Link to="">
                  <Trophy className="mr-2 h-4 w-4" /> Live Leaderboard
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-3">
          {[
            { label: "Contestants", value: formatNumber(stats.data?.total_contestants), Icon: Users },
            { label: "Voting", value: "Open", Icon: Sparkles },
            { label: "Crown", value: "1", Icon: Crown },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <Icon className="h-5 w-5 text-gold" />
              <div className="font-display text-3xl md:text-4xl">{value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP 3 */}
      {/* {top3.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Header label="Frontrunners" title="Top 3 Contestants" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {top3.map((c, i) => (
              <div key={c.id} className="relative">
                <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${["gradient-gold text-onyx", "bg-pearl border text-foreground", "bg-rose-soft text-rose"][i]}`}>
                  <Trophy className="h-3.5 w-3.5" /> {["1st Place", "2nd Place", "3rd Place"][i]}
                </div>
                <ContestantCard c={c} rank={i + 1} />
              </div>
            ))}
          </div>
        </section>
      )} */}

      {/* FEATURED */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <Header label="The Lineup" title="Featured Contestants" />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/contestants">See all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(featured.data ?? []).slice(0, 8).map((c) => (
              <ContestantCard key={c.id} c={c} />
            ))}
          </div>
          {(!featured.data || featured.data.length === 0) && (
            <p className="mt-10 text-center text-muted-foreground">Contestants will appear here soon.</p>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Header label="The Process" title="How Voting Works" centered />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { t: "Choose", d: "Pick your favourite contestant from the lineup." },
            { t: "Select Votes", d: `Each vote costs ${settings.data ? `₦${Number(settings.data.vote_price).toLocaleString()}` : "₦100"}. Buy as many as you like.` },
            { t: "Transfer", d: "Send the total amount via bank transfer to MU Icons." },
            { t: "Upload Proof", d: "Submit your receipt; votes are added once approved." },
          ].map((s, i) => (
            <div key={s.t} className="rounded-2xl border bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-gold font-display text-lg text-onyx">{i + 1}</div>
              <h3 className="mt-4 font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 rounded-2xl gradient-onyx p-8 text-pearl">
          <CheckCircle2 className="h-6 w-6 text-gold" />
          <p className="text-sm">All votes are verified by our admin team before being added to the live count.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Header label="Get in touch" title="Contact MU Icons" centered />
          <p className="mt-6 text-muted-foreground">
            Questions about voting, sponsorship, or the competition? We'd love to hear from you.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Email", v: "hello@muicons.com" },
              { t: "Phone", v: "+234 800 000 0000" },
              { t: "Instagram", v: "@mu.icons" },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border bg-background p-5">
                <div className="text-xs uppercase tracking-widest text-gold">{x.t}</div>
                <div className="mt-1 font-medium">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Header({ label, title, centered }: { label: string; title: string; centered?: boolean }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold`}>
        <span className="h-px w-8 bg-gold" /> {label}
      </div>
      <h2 className="mt-3 font-display text-4xl md:text-5xl">{title}</h2>
    </div>
  );
}
