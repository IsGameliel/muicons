import { t as supabase } from "./client-CKv989Sf.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatNaira, r as formatNumber } from "./format-DHr__noG.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-YRbIP-0k.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.78 0.13 86)",
	"oklch(0.72 0.16 12)",
	"oklch(0.14 0.01 30)",
	"oklch(0.6 0.12 30)",
	"oklch(0.55 0.18 280)"
];
function Analytics() {
	const tx = useQuery({
		queryKey: ["analytics-tx"],
		queryFn: async () => {
			const { data } = await supabase.from("transactions").select("amount, number_of_votes, status, created_at, contestant_id").eq("status", "approved");
			return data ?? [];
		}
	});
	const contestants = useQuery({
		queryKey: ["analytics-contestants"],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("id, full_name, total_votes").order("total_votes", { ascending: false });
			return data ?? [];
		}
	});
	const now = /* @__PURE__ */ new Date();
	const dayStart = new Date(now);
	dayStart.setHours(0, 0, 0, 0);
	const weekStart = new Date(now);
	weekStart.setDate(now.getDate() - 7);
	const monthStart = new Date(now);
	monthStart.setDate(now.getDate() - 30);
	const sum = (xs, since) => (xs ?? []).filter((x) => !since || new Date(x.created_at) >= since).reduce((a, b) => a + Number(b.amount ?? 0), 0);
	const totals = {
		revenue: sum(tx.data),
		today: sum(tx.data, dayStart),
		week: sum(tx.data, weekStart),
		month: sum(tx.data, monthStart),
		votes: (tx.data ?? []).reduce((a, b) => a + (b.number_of_votes ?? 0), 0)
	};
	const daily = (() => {
		const map = /* @__PURE__ */ new Map();
		for (let i = 29; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const k = d.toISOString().slice(0, 10);
			map.set(k, {
				day: d.toLocaleDateString("en", {
					month: "short",
					day: "numeric"
				}),
				votes: 0,
				revenue: 0
			});
		}
		(tx.data ?? []).forEach((t) => {
			const k = t.created_at.slice(0, 10);
			const e = map.get(k);
			if (!e) return;
			e.votes += t.number_of_votes ?? 0;
			e.revenue += Number(t.amount ?? 0);
		});
		return Array.from(map.values());
	})();
	const topPie = (contestants.data ?? []).slice(0, 5).map((c) => ({
		name: c.full_name.split(" ")[0],
		value: c.total_votes
	}));
	const cards = [
		{
			label: "Total Revenue",
			value: formatNaira(totals.revenue)
		},
		{
			label: "Today",
			value: formatNaira(totals.today)
		},
		{
			label: "This Week",
			value: formatNaira(totals.week)
		},
		{
			label: "This Month",
			value: formatNaira(totals.month)
		},
		{
			label: "Total Votes",
			value: formatNumber(totals.votes)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Revenue, votes, and performance breakdowns."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Revenue (30 days)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: daily,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "oklch(0.9 0.01 80)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: { fontSize: 10 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "revenue",
										stroke: "oklch(0.72 0.16 12)",
										strokeWidth: 2.5,
										dot: false
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Daily Votes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: daily,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "oklch(0.9 0.01 80)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: { fontSize: 10 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "votes",
										fill: "oklch(0.78 0.13 86)",
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Top 5 share",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: topPie,
									dataKey: "value",
									nameKey: "name",
									outerRadius: 100,
									label: true,
									children: topPie.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})
							] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Votes per contestant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: (contestants.data ?? []).slice(0, 10).map((c) => ({
									name: c.full_name.split(" ")[0],
									votes: c.total_votes
								})),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "oklch(0.9 0.01 80)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 10 }
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
					})
				]
			})
		]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-lg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 h-72",
			children
		})]
	});
}
//#endregion
export { Analytics as component };
