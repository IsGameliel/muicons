import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { ContestantCard, type Contestant } from "@/components/ContestantCard";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contestants")({
  head: () => ({
    meta: [
      { title: "Contestants — MU Icons" },
      { name: "description", content: "Browse all contestants. Search, filter, and cast your votes." },
      { property: "og:title", content: "All Contestants — MU Icons" },
    ],
  }),
  component: ContestantsPage,
});

function ContestantsPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"votes" | "number" | "name">("votes");
  const [faculty, setFaculty] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["contestants-all"],
    queryFn: async (): Promise<Contestant[]> => {
      const { data } = await supabase
        .from("contestants")
        .select("id, contestant_number, full_name, faculty, image, total_votes, status")
        .eq("status", "active");
      return (data ?? []) as Contestant[];
    },
  });

  const faculties = useMemo(() => {
    const s = new Set<string>();
    data?.forEach((c) => c.faculty && s.add(c.faculty));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (q) {
      const t = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(t) ||
          String(c.contestant_number).includes(t) ||
          c.faculty?.toLowerCase().includes(t),
      );
    }
    if (faculty !== "all") list = list.filter((c) => c.faculty === faculty);
    list = [...list].sort((a, b) =>
      sort === "votes"
        ? b.total_votes - a.total_votes
        : sort === "number"
          ? a.contestant_number - b.contestant_number
          : a.full_name.localeCompare(b.full_name),
    );
    return list;
  }, [data, q, sort, faculty]);

  return (
    <PublicLayout>
      <section className="border-b bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">The Lineup</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">All Contestants</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Meet every contestant competing for the crown. Search, filter and vote for your favourite.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, number or faculty…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={faculty} onValueChange={setFaculty}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="Faculty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All faculties</SelectItem>
              {faculties.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as "votes" | "number" | "name")}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Current ranking</SelectItem>
              <SelectItem value="number">Contestant #</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c, i) => (
            <ContestantCard key={c.id} c={c} rank={sort === "votes" ? i + 1 : undefined} />
          ))}
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No contestants found.</div>
        )}
      </section>
    </PublicLayout>
  );
}
