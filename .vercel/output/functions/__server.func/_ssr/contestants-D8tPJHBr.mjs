import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { p as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as PublicLayout } from "./PublicLayout-CVCzS5nS.mjs";
import { t as ContestantCard } from "./ContestantCard-CIO50AWC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contestants-D8tPJHBr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContestantsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("votes");
	const [faculty, setFaculty] = (0, import_react.useState)("all");
	const { data, isLoading } = useQuery({
		queryKey: ["contestants-all"],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("id, contestant_number, full_name, faculty, image, total_votes, status").eq("status", "active");
			return data ?? [];
		}
	});
	const faculties = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		data?.forEach((c) => c.faculty && s.add(c.faculty));
		return Array.from(s).sort();
	}, [data]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = data ?? [];
		if (q) {
			const t = q.toLowerCase();
			list = list.filter((c) => c.full_name.toLowerCase().includes(t) || String(c.contestant_number).includes(t) || c.faculty?.toLowerCase().includes(t));
		}
		if (faculty !== "all") list = list.filter((c) => c.faculty === faculty);
		list = [...list].sort((a, b) => sort === "votes" ? b.total_votes - a.total_votes : sort === "number" ? a.contestant_number - b.contestant_number : a.full_name.localeCompare(b.full_name));
		return list;
	}, [
		data,
		q,
		sort,
		faculty
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b bg-card py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.25em] text-gold",
					children: "The Lineup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl md:text-5xl",
					children: "All Contestants"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: "Meet every contestant competing for the crown. Search, filter and vote for your favourite."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by name, number or faculty…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: faculty,
						onValueChange: setFaculty,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Faculty" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All faculties"
						}), faculties.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: f,
							children: f
						}, f))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onValueChange: (v) => setSort(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "sm:w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "votes",
								children: "Current ranking"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "number",
								children: "Contestant #"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "name",
								children: "Name (A–Z)"
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filtered.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContestantCard, {
					c,
					rank: sort === "votes" ? i + 1 : void 0
				}, c.id))
			}),
			!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-20 text-center text-muted-foreground",
				children: "No contestants found."
			})
		]
	})] });
}
//#endregion
export { ContestantsPage as component };
