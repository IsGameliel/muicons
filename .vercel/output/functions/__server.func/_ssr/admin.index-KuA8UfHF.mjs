import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-aC9CX6Xo.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as LoaderCircle, E as Heart, F as Clock, L as CircleX, M as DollarSign, R as CircleCheck, m as RotateCcw, n as Users } from "../_libs/lucide-react.mjs";
import { n as formatNaira, r as formatNumber } from "./format-DHr__noG.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, n as BarChart, o as Line, r as LineChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-KuA8UfHF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const qc = useQueryClient();
	const [resettingVotes, setResettingVotes] = (0, import_react.useState)(false);
	const { data: stats } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: async () => {
			const [{ count: contestants }, contestantSum, pending, approved, rejected, revenueRow] = await Promise.all([
				supabase.from("contestants").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("contestants").select("total_votes"),
				supabase.from("transactions").select("id", {
					count: "exact",
					head: true
				}).eq("status", "pending"),
				supabase.from("transactions").select("id", {
					count: "exact",
					head: true
				}).eq("status", "approved"),
				supabase.from("transactions").select("id", {
					count: "exact",
					head: true
				}).eq("status", "rejected"),
				supabase.from("transactions").select("amount").eq("status", "approved")
			]);
			const totalVotes = (contestantSum.data ?? []).reduce((a, b) => a + (b.total_votes ?? 0), 0);
			const revenue = (revenueRow.data ?? []).reduce((a, b) => a + Number(b.amount ?? 0), 0);
			return {
				contestants: contestants ?? 0,
				totalVotes,
				pending: pending.count ?? 0,
				approved: approved.count ?? 0,
				rejected: rejected.count ?? 0,
				revenue
			};
		}
	});
	const { data: chartData } = useQuery({
		queryKey: ["admin-daily-votes"],
		queryFn: async () => {
			const since = /* @__PURE__ */ new Date();
			since.setDate(since.getDate() - 13);
			const { data } = await supabase.from("transactions").select("created_at, number_of_votes, amount, status").eq("status", "approved").gte("created_at", since.toISOString());
			const map = /* @__PURE__ */ new Map();
			for (let i = 13; i >= 0; i--) {
				const d = /* @__PURE__ */ new Date();
				d.setDate(d.getDate() - i);
				const key = d.toISOString().slice(0, 10);
				map.set(key, {
					day: d.toLocaleDateString("en", {
						month: "short",
						day: "numeric"
					}),
					votes: 0,
					revenue: 0
				});
			}
			(data ?? []).forEach((t) => {
				const key = t.created_at.slice(0, 10);
				const e = map.get(key);
				if (!e) return;
				e.votes += t.number_of_votes ?? 0;
				e.revenue += Number(t.amount ?? 0);
			});
			return Array.from(map.values());
		}
	});
	const { data: topContestants } = useQuery({
		queryKey: ["admin-top-contestants"],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("full_name, total_votes").order("total_votes", { ascending: false }).limit(7);
			return (data ?? []).map((c) => ({
				name: c.full_name.split(" ")[0],
				votes: c.total_votes
			}));
		}
	});
	const cards = [
		{
			label: "Contestants",
			value: formatNumber(stats?.contestants),
			Icon: Users,
			tone: ""
		},
		{
			label: "Total Votes",
			value: formatNumber(stats?.totalVotes),
			Icon: Heart,
			tone: ""
		},
		{
			label: "Pending",
			value: formatNumber(stats?.pending),
			Icon: Clock,
			tone: "text-warning"
		},
		{
			label: "Approved",
			value: formatNumber(stats?.approved),
			Icon: CircleCheck,
			tone: "text-success"
		},
		{
			label: "Rejected",
			value: formatNumber(stats?.rejected),
			Icon: CircleX,
			tone: "text-destructive"
		},
		{
			label: "Revenue",
			value: formatNaira(stats?.revenue),
			Icon: DollarSign,
			tone: "text-gold"
		}
	];
	async function resetVotes() {
		if (!confirm("Reset all contestant vote counts to 0? This cannot be undone.")) return;
		setResettingVotes(true);
		try {
			const { error } = await supabase.from("contestants").update({ total_votes: 0 }).neq("id", "00000000-0000-0000-0000-000000000000");
			if (error) throw error;
			toast.success("Vote counts reset to 0");
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to reset votes");
		} finally {
			setResettingVotes(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Live overview of the MU Icons pageant."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: resetVotes,
					disabled: resettingVotes,
					children: [resettingVotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Reset votes"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
				children: cards.map(({ label, value, Icon, tone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${tone}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl",
						children: value ?? "—"
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: "Votes (last 14 days)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chartData ?? [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "oklch(0.9 0.01 80)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "votes",
										stroke: "oklch(0.78 0.13 86)",
										strokeWidth: 2.5,
										dot: { r: 3 }
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: "Top contestants"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: topContestants ?? [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "oklch(0.9 0.01 80)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "votes",
										fill: "oklch(0.72 0.16 12)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
