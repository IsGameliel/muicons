import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignedImage } from "@/components/SignedImage";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/contestants")({
  component: AdminContestants,
});

type C = {
  id?: string;
  contestant_number: number;
  full_name: string;
  faculty: string;
  biography: string;
  image: string | null;
  status: "active" | "inactive";
  top_rank?: number | null;
  total_votes?: number;
};

const empty: C = { contestant_number: 1, full_name: "", faculty: "", biography: "", image: null, status: "active" };

function AdminContestants() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<C | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingRank, setSavingRank] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-contestants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contestants").select("*")
        .order("contestant_number");
      return (data ?? []) as C[];
    },
  });

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      let imagePath = editing.image;
      if (file) imagePath = await uploadFile("contestant-photos", file, "");
      const payload = {
        contestant_number: editing.contestant_number,
        full_name: editing.full_name.trim(),
        faculty: editing.faculty.trim() || null,
        biography: editing.biography.trim() || null,
        image: imagePath,
        status: editing.status,
      };
      if (editing.id) {
        const { error } = await supabase.from("contestants").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Contestant updated");
      } else {
        const { error } = await supabase.from("contestants").insert(payload);
        if (error) throw error;
        toast.success("Contestant added");
      }
      setEditing(null); setFile(null);
      qc.invalidateQueries({ queryKey: ["admin-contestants"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this contestant? This cannot be undone.")) return;
    const { error } = await supabase.from("contestants").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-contestants"] }); }
  }

  async function toggleStatus(c: C) {
    const status = c.status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("contestants").update({ status }).eq("id", c.id!);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-contestants"] });
  }

  async function setTopRank(rank: number, contestantId: string) {
    setSavingRank(rank);
    try {
      if (contestantId === "none") {
        const { error } = await supabase.from("contestants").update({ top_rank: null }).eq("top_rank", rank);
        if (error) throw error;
      } else {
        const { error: clearError } = await supabase
          .from("contestants")
          .update({ top_rank: null })
          .or(`top_rank.eq.${rank},id.eq.${contestantId}`);
        if (clearError) throw clearError;

        const { error } = await supabase.from("contestants").update({ top_rank: rank }).eq("id", contestantId);
        if (error) throw error;
      }

      toast.success(`Top ${rank} updated`);
      qc.invalidateQueries();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not update Top 3");
    } finally {
      setSavingRank(null);
    }
  }

  const nextNumber = Math.max(0, ...(data ?? []).map((c) => c.contestant_number)) + 1;
  const activeContestants = (data ?? []).filter((c) => c.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Contestants</h1>
          <p className="text-sm text-muted-foreground">Manage the lineup, photos, and active status.</p>
        </div>
        <Button onClick={() => { setEditing({ ...empty, contestant_number: nextNumber }); setFile(null); }} className="gradient-gold text-onyx">
          <Plus className="mr-2 h-4 w-4" /> Add contestant
        </Button>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Top 3 Contestants</h2>
            <p className="text-sm text-muted-foreground">Choose who appears in the homepage Top 3 section.</p>
          </div>
          <Badge variant="secondary">Homepage</Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((rank) => {
            const selected = activeContestants.find((c) => c.top_rank === rank)?.id ?? "none";
            return (
              <div key={rank}>
                <Label>{["1st Place", "2nd Place", "3rd Place"][rank - 1]}</Label>
                <Select value={selected} onValueChange={(value) => setTopRank(rank, value)} disabled={savingRank !== null}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Automatic by votes</SelectItem>
                    {activeContestants.map((c) => (
                      <SelectItem key={c.id} value={c.id!}>
                        #{c.contestant_number} - {c.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingRank === rank && <div className="mt-1 text-xs text-muted-foreground">Saving...</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {(data ?? []).map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border bg-card">
            <div className="relative aspect-[3/4]">
              <SignedImage bucket="contestant-photos" path={c.image} alt={c.full_name} className="h-full w-full object-cover" fallbackClassName="h-full w-full" />
              <Badge className="absolute left-2 top-2 gradient-gold text-onyx border-0">#{c.contestant_number}</Badge>
              <Badge variant={c.status === "active" ? "default" : "secondary"} className="absolute right-2 top-2">{c.status}</Badge>
            </div>
            <div className="p-3">
              <div className="truncate font-display text-lg">{c.full_name}</div>
              <div className="truncate text-xs text-muted-foreground">{c.faculty ?? "—"}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span>{formatNumber(c.total_votes)} votes</span>
                {c.top_rank && <Badge variant="secondary">Top {c.top_rank}</Badge>}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Switch checked={c.status === "active"} onCheckedChange={() => toggleStatus(c)} />
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setFile(null); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(c.id!)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} contestant</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contestant #</Label>
                  <Input type="number" value={editing.contestant_number}
                    onChange={(e) => setEditing({ ...editing, contestant_number: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Switch checked={editing.status === "active"}
                      onCheckedChange={(v) => setEditing({ ...editing, status: v ? "active" : "inactive" })} />
                    <span className="text-sm">{editing.status}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Full name</Label>
                <Input value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} />
              </div>
              <div>
                <Label>Faculty / Department</Label>
                <Input value={editing.faculty} onChange={(e) => setEditing({ ...editing, faculty: e.target.value })} />
              </div>
              <div>
                <Label>Biography</Label>
                <Textarea rows={4} value={editing.biography} onChange={(e) => setEditing({ ...editing, biography: e.target.value })} />
              </div>
              <div>
                <Label>Photo</Label>
                <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-gold">
                  <Upload className="h-4 w-4" />
                  {file ? file.name : editing.image ? "Replace photo" : "Upload photo"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="gradient-gold text-onyx">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
