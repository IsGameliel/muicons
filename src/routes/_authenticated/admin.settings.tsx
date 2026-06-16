import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

type Settings = {
  competition_name: string;
  competition_banner: string | null;
  voting_open: boolean;
  bank_account_name: string;
  bank_name: string;
  account_number: string;
  vote_price: number;
};

function AdminSettings() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      return data as Settings | null;
    },
  });

  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

  async function save() {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update({
      competition_name: form.competition_name,
      voting_open: form.voting_open,
      bank_account_name: form.bank_account_name,
      bank_name: form.bank_name,
      account_number: form.account_number,
      vote_price: form.vote_price,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  }

  if (!form) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure the competition and bank details.</p>
      </div>

      <Section title="Competition">
        <Field label="Competition name">
          <Input value={form.competition_name} onChange={(e) => setForm({ ...form, competition_name: e.target.value })} />
        </Field>
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <Label>Voting open</Label>
            <p className="text-xs text-muted-foreground">When off, no new submissions are accepted.</p>
          </div>
          <Switch checked={form.voting_open} onCheckedChange={(v) => setForm({ ...form, voting_open: v })} />
        </div>
        <Field label="Price per vote (₦)">
          <Input type="number" min={1} value={form.vote_price}
            onChange={(e) => setForm({ ...form, vote_price: Number(e.target.value) })} />
        </Field>
      </Section>

      <Section title="Bank account">
        <Field label="Bank name"><Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} /></Field>
        <Field label="Account name"><Input value={form.bank_account_name} onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })} /></Field>
        <Field label="Account number"><Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} /></Field>
      </Section>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="gradient-gold text-onyx">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save changes
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block">{label}</Label>{children}</div>;
}
