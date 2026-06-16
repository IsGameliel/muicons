import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Trophy } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/contestants/$id")({
  head: () => ({
    meta: [
      { title: "Contestant — MU Icons" },
      { name: "description", content: "Contestant profile, biography, and live vote count." },
    ],
  }),
  component: ContestantProfile,
});

function ContestantProfile() {
  const { id } = Route.useParams();

  const { data: c, isLoading } = useQuery({
    queryKey: ["contestant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contestants")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: rank } = useQuery({
    queryKey: ["contestant-rank", id, c?.total_votes],
    enabled: !!c,
    queryFn: async () => {
      const { count } = await supabase
        .from("contestants")
        .select("id", { count: "exact", head: true })
        .gt("total_votes", c!.total_votes);
      return (count ?? 0) + 1;
    },
  });

  if (isLoading) {
    return <PublicLayout><div className="py-32 text-center text-muted-foreground">Loading…</div></PublicLayout>;
  }
  if (!c) return null;

  return (
    <PublicLayout>
      <section className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/contestants"><ArrowLeft className="mr-2 h-4 w-4" /> All contestants</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border shadow-luxe">
            <SignedImage
              bucket="contestant-photos"
              path={c.image}
              alt={c.full_name}
              className="aspect-[3/4] w-full object-cover"
              fallbackClassName="aspect-[3/4] w-full"
            />
          </div>
          <div>
            <Badge className="gradient-gold text-onyx border-0">Contestant #{c.contestant_number}</Badge>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">{c.full_name}</h1>
            {c.faculty && <p className="mt-2 text-lg text-muted-foreground">{c.faculty}</p>}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                  <Heart className="h-4 w-4" /> Total Votes
                </div>
                <div className="mt-2 font-display text-4xl">{formatNumber(c.total_votes)}</div>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                  <Trophy className="h-4 w-4" /> Current Rank
                </div>
                <div className="mt-2 font-display text-4xl">#{rank ?? "—"}</div>
              </div>
            </div>

            {c.biography && (
              <div className="mt-8">
                <h2 className="font-display text-2xl">Biography</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{c.biography}</p>
              </div>
            )}

            <div className="mt-10">
              <Button asChild size="lg" className="gradient-gold text-onyx">
                <Link to="/vote/$id" params={{ id: c.id }}>
                  <Heart className="mr-2 h-4 w-4" /> Vote for {c.full_name.split(" ")[0]}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
