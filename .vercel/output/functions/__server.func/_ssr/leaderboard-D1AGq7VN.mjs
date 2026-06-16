import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as Award, N as Crown, b as Medal, o as Trophy } from "../_libs/lucide-react.mjs";
import { r as formatNumber } from "./format-DHr__noG.mjs";
import { t as SignedImage } from "./SignedImage-DPKDe6DI.mjs";
import { t as PublicLayout } from "./PublicLayout-CVCzS5nS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-D1AGq7VN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaderboardPage() {
	const qc = useQueryClient();
	const { data, refetch } = useQuery({
		queryKey: ["leaderboard"],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("id, contestant_number, full_name, faculty, image, total_votes").order("total_votes", { ascending: false }).limit(50);
			return data ?? [];
		},
		refetchInterval: 15e3
	});
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel("leaderboard-realtime").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "contestants"
		}, () => {
			qc.invalidateQueries({ queryKey: ["leaderboard"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [qc]);
	const podium = (data ?? []).slice(0, 3);
	const rest = (data ?? []).slice(3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden gradient-onyx py-20 text-pearl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-30",
				style: { background: "radial-gradient(circle at 30% 20%, oklch(0.78 0.13 86 / .4), transparent 60%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 text-center sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/40 px-4 py-1.5 text-xs uppercase tracking-widest text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5" }), " Live Standings"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-5xl md:text-6xl",
						children: "The Leaderboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-pearl/80",
						children: "Updated every 15 seconds. Cast your vote and watch them rise."
					})
				]
			}),
			podium.length >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto mt-14 grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-3 md:items-end",
				children: [
					1,
					0,
					2
				].map((idx, i) => {
					const c = podium[idx];
					if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, i);
					const place = idx + 1;
					const heights = [
						"md:mb-8",
						"md:mb-16",
						"md:mb-0"
					];
					const ring = [
						"ring-pearl",
						"ring-gold",
						"ring-rose"
					][idx];
					const Icon = [
						Trophy,
						Crown,
						Medal
					][idx];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contestants/$id",
						params: { id: c.id },
						className: `group relative ${heights[i]}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-pearl/10 bg-onyx/40 p-5 backdrop-blur transition hover:bg-onyx/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mx-auto h-44 w-44 overflow-hidden rounded-full ring-4 ring-offset-4 ring-offset-onyx",
								style: { boxShadow: "0 0 50px oklch(0.78 0.13 86 / .3)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
									bucket: "contestant-photos",
									path: c.image,
									alt: c.full_name,
									className: `h-full w-full object-cover ${ring}`,
									fallbackClassName: "h-full w-full"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `mx-auto flex h-9 w-9 items-center justify-center rounded-full ${place === 1 ? "gradient-gold text-onyx" : "bg-pearl/10 text-pearl"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-xs uppercase tracking-widest text-gold",
										children: [
											"1st Place",
											"2nd Place",
											"3rd Place"
										][idx]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-display text-2xl text-pearl",
										children: c.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-pearl/60",
										children: [
											"#",
											c.contestant_number,
											" · ",
											c.faculty ?? "—"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 font-display text-4xl text-gold-shine",
										children: formatNumber(c.total_votes)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-widest text-pearl/60",
										children: "votes"
									})
								]
							})]
						})
					}, c.id);
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Full Ranking"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => refetch(),
				children: "Refresh"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-6 divide-y rounded-2xl border bg-card",
			children: [rest.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/contestants/$id",
				params: { id: c.id },
				className: "flex items-center gap-4 px-5 py-4 hover:bg-accent/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-8 text-center font-display text-xl text-muted-foreground",
						children: i + 4
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 overflow-hidden rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
							bucket: "contestant-photos",
							path: c.image,
							alt: c.full_name,
							className: "h-full w-full object-cover",
							fallbackClassName: "h-full w-full"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: c.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								"#",
								c.contestant_number,
								" · ",
								c.faculty ?? "—"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-lg",
							children: formatNumber(c.total_votes)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "votes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-gold opacity-0 group-hover:opacity-100" })
				]
			}) }, c.id)), rest.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-5 py-10 text-center text-sm text-muted-foreground",
				children: "No more contestants."
			})]
		})]
	})] });
}
//#endregion
export { LeaderboardPage as component };
