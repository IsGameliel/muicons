import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Copy, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { PublicLayout } from "@/components/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/vote/$id")({
  head: () => ({ meta: [{ title: "Vote — MU Icons" }] }),
  component: VotePage,
});

const schema = z.object({
  voter_name: z.string().trim().min(2, "Enter your full name").max(120),
  voter_email: z.string().trim().email("Invalid email").max(200),
  voter_phone: z.string().trim().min(7, "Enter your phone").max(30),
  votes: z.number().int().min(1).max(10000),
});

function VotePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(1);
  const [form, setForm] = useState({ voter_name: "", voter_email: "", voter_phone: "" });
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const contestant = useQuery({
    queryKey: ["contestant", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("contestants")
        .select("id, full_name, faculty, image, contestant_number")
        .eq("id", id).maybeSingle();
      return data;
    },
  });

  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });

  const price = Number(settings.data?.vote_price ?? 100);
  const amount = useMemo(() => price * votes, [price, votes]);
  const votingOpen = settings.data?.voting_open ?? true;

  async function submit() {
    if (!votingOpen) return toast.error("Voting is currently closed.");
    if (!proof) return toast.error("Please upload your payment proof.");
    const parsed = schema.safeParse({ ...form, votes });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    try {
      const path = await uploadFile("payment-proofs", proof, `${id}/`);
      const { error } = await supabase.from("transactions").insert({
        contestant_id: id,
        voter_name: form.voter_name.trim(),
        voter_email: form.voter_email.trim().toLowerCase(),
        voter_phone: form.voter_phone.trim(),
        number_of_votes: votes,
        amount,
        payment_proof: path,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Submission received — awaiting admin approval.");
    } catch (e) {
      console.error(e);
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const c = contestant.data;
  const s = settings.data;

  if (done) {
    return (
      <PublicLayout>
        <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl">Thank you!</h1>
          <p className="mt-3 text-muted-foreground">
            Your payment is being verified. Votes will be added to {c?.full_name} once approved.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild variant="outline"><Link to="/leaderboard">View leaderboard</Link></Button>
            <Button asChild className="gradient-gold text-onyx"><Link to="/contestants">Back to contestants</Link></Button>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-card border-b">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/contestants/$id" params={{ id }}><ArrowLeft className="mr-2 h-4 w-4" /> Back to profile</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.25fr]">
        {/* Summary */}
        <aside className="space-y-4">
          {c && (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <SignedImage bucket="contestant-photos" path={c.image} alt={c.full_name} className="aspect-[3/4] w-full object-cover" fallbackClassName="aspect-[3/4] w-full" />
              <div className="p-4">
                <Badge className="gradient-gold text-onyx border-0">#{c.contestant_number}</Badge>
                <h2 className="mt-2 font-display text-2xl">{c.full_name}</h2>
                {c.faculty && <p className="text-sm text-muted-foreground">{c.faculty}</p>}
              </div>
            </div>
          )}
          <div className="rounded-2xl gradient-onyx p-5 text-pearl">
            <div className="text-xs uppercase tracking-widest text-gold">You're voting for</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-3xl">{votes}</span>
              <span className="text-pearl/80">votes</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-display text-3xl text-gold">{formatNaira(amount)}</span>
              <span className="text-pearl/80">total</span>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="space-y-6 rounded-2xl border bg-card p-6 md:p-8">
          {!votingOpen && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              Voting is currently closed. Please check back later.
            </div>
          )}

          <div>
            <Label>Number of votes ({formatNaira(price)} each)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 5, 10, 25, 50, 100].map((n) => (
                <button
                  key={n} type="button" onClick={() => setVotes(n)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${votes === n ? "gradient-gold text-onyx border-transparent" : "hover:bg-accent"}`}
                >
                  {n}
                </button>
              ))}
              <Input
                type="number" min={1} value={votes}
                onChange={(e) => setVotes(Math.max(1, Number(e.target.value) || 1))}
                className="w-28"
              />
            </div>
          </div>

          {/* Bank details */}
          <div className="rounded-xl border bg-secondary/40 p-5">
            <h3 className="font-display text-lg">Transfer to:</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Bank Name", s?.bank_name ?? "—"],
                ["Account Name", s?.bank_account_name ?? "—"],
                ["Account Number", s?.account_number ?? "—"],
                ["Amount", formatNaira(amount)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="flex items-center gap-2 font-medium">
                    {v}
                    <button type="button" onClick={() => { navigator.clipboard.writeText(String(v)); toast.success("Copied"); }}>
                      <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Voter info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={form.voter_name} onChange={(e) => setForm({ ...form, voter_name: e.target.value })} />
            </Field>
            <Field label="Phone number">
              <Input value={form.voter_phone} onChange={(e) => setForm({ ...form, voter_phone: e.target.value })} />
            </Field>
            <Field label="Email address" className="sm:col-span-2">
              <Input type="email" value={form.voter_email} onChange={(e) => setForm({ ...form, voter_email: e.target.value })} />
            </Field>
          </div>

          {/* Upload proof */}
          <div>
            <Label>Upload payment proof</Label>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background px-4 py-8 text-sm text-muted-foreground hover:border-gold">
              <Upload className="h-5 w-5" />
              {proof ? proof.name : "Click to upload receipt (JPG/PNG/PDF)"}
              <input
                type="file" className="sr-only" accept="image/*,application/pdf"
                onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <Button
            onClick={submit}
            disabled={submitting || !votingOpen}
            size="lg"
            className="w-full gradient-gold text-onyx"
          >
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : `Submit Vote · ${formatNaira(amount)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Votes are added once your transfer is verified by an admin.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
