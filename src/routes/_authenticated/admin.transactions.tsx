import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Eye, Check, X, Search, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignedImage } from "@/components/SignedImage";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  component: AdminTransactions,
});

type Tx = {
  id: string;
  contestant_id: string;
  voter_name: string;
  voter_email: string;
  voter_phone: string;
  number_of_votes: number;
  amount: number;
  payment_proof: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  contestant?: { full_name: string; contestant_number: number } | null;
};

function AdminTransactions() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<Tx | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tx"],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*, contestant:contestants(full_name, contestant_number)")
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as Tx[];
    },
  });

  // Realtime: refresh on any transaction change
  useEffect(() => {
    const ch = supabase
      .channel("admin-tx-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-tx"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (tab !== "all") list = list.filter((t) => t.status === tab);
    if (q) {
      const t = q.toLowerCase();
      list = list.filter((x) =>
        x.voter_name.toLowerCase().includes(t) ||
        x.voter_email.toLowerCase().includes(t) ||
        x.voter_phone.includes(t) ||
        x.contestant?.full_name?.toLowerCase().includes(t)
      );
    }
    return list;
  }, [data, tab, q]);

  async function approve(id: string) {
    const { error } = await supabase.rpc("approve_transaction", { _tx_id: id });
    if (error) toast.error(error.message);
    else { toast.success("Approved — votes added"); qc.invalidateQueries(); }
  }
  async function reject(id: string) {
    if (!confirm("Reject this transaction?")) return;
    const { error } = await supabase.rpc("reject_transaction", { _tx_id: id });
    if (error) toast.error(error.message);
    else { toast.success("Rejected"); qc.invalidateQueries(); }
  }

  const exportRows = () =>
    filtered.map((t) => ({
      Date: new Date(t.created_at).toISOString(),
      Voter: t.voter_name,
      Email: t.voter_email,
      Phone: t.voter_phone,
      Contestant: t.contestant?.full_name ?? "",
      Votes: t.number_of_votes,
      Amount: t.amount,
      Status: t.status,
    }));

  function exportCSV() {
    const rows = exportRows();
    const header = Object.keys(rows[0] ?? { Date: "" });
    const csv = [header, ...rows.map((r) => header.map((h) => (r as Record<string, unknown>)[h]))]
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `transactions-${stamp()}.csv`);
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(exportRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    downloadBlob(new Blob([buf], { type: "application/octet-stream" }), `transactions-${stamp()}.xlsx`);
  }

  function exportPDF() {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("MU Icons — Transactions", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()} · ${filtered.length} rows`, 14, 22);
    const rows = filtered.map((t) => [
      formatDate(t.created_at), t.voter_name, t.voter_email, t.voter_phone,
      t.contestant?.full_name ?? "—", String(t.number_of_votes), formatNaira(t.amount), t.status,
    ]);
    autoTable(doc, {
      head: [["Date", "Voter", "Email", "Phone", "Contestant", "Votes", "Amount", "Status"]],
      body: rows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [212, 175, 55] },
    });
    doc.save(`transactions-${stamp()}.pdf`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Transactions</h1>
          <p className="text-sm text-muted-foreground">Review and approve voter payments.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" />Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2 h-4 w-4" />CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" />Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}><FileText className="mr-2 h-4 w-4" />PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Voter</th>
              <th className="px-4 py-3">Contestant</th>
              <th className="px-4 py-3">Votes</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No transactions.</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-accent/20">
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(t.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{t.voter_name}</div>
                  <div className="text-xs text-muted-foreground">{t.voter_email}</div>
                  <div className="text-xs text-muted-foreground">{t.voter_phone}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {t.contestant ? `#${t.contestant.contestant_number} · ${t.contestant.full_name}` : "—"}
                </td>
                <td className="px-4 py-3 font-medium">{t.number_of_votes}</td>
                <td className="px-4 py-3 font-medium">{formatNaira(t.amount)}</td>
                <td className="px-4 py-3">
                  <Badge variant={t.status === "approved" ? "default" : t.status === "rejected" ? "destructive" : "secondary"}>
                    {t.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewing(t)}><Eye className="h-4 w-4" /></Button>
                    {t.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => approve(t.id)}><Check className="h-4 w-4 text-success" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => reject(t.id)}><X className="h-4 w-4 text-destructive" /></Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Payment proof</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Voter" value={viewing.voter_name} />
                <Info label="Status" value={viewing.status} />
                <Info label="Email" value={viewing.voter_email} />
                <Info label="Phone" value={viewing.voter_phone} />
                <Info label="Votes" value={String(viewing.number_of_votes)} />
                <Info label="Amount" value={formatNaira(viewing.amount)} />
              </div>
              {viewing.payment_proof ? (
                <div className="overflow-hidden rounded-xl border">
                  <SignedImage bucket="payment-proofs" path={viewing.payment_proof} alt="Payment proof"
                    className="max-h-[60vh] w-full object-contain bg-muted" fallbackClassName="h-60 w-full" />
                </div>
              ) : <p className="text-muted-foreground">No proof uploaded.</p>}
              {viewing.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { reject(viewing.id); setViewing(null); }}>Reject</Button>
                  <Button className="gradient-gold text-onyx" onClick={() => { approve(viewing.id); setViewing(null); }}>Approve</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function stamp() { return new Date().toISOString().slice(0, 10); }
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
