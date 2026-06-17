import { t as supabase } from "./client-CKv989Sf.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as ArrowRight, N as Crown, R as CircleCheck, l as Sparkles, n as Users } from "../_libs/lucide-react.mjs";
import { r as formatNumber } from "./format-DHr__noG.mjs";
import { t as PublicLayout } from "./PublicLayout-DHu92M1d.mjs";
import { t as ContestantCard } from "./ContestantCard-CIO50AWC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CzA0-LLg.js
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-ByW_sU4H.jpg";
function useFeatured() {
	return useQuery({
		queryKey: ["featured-contestants"],
		queryFn: async () => {
			const { data, error } = await supabase.from("contestants").select("id, contestant_number, full_name, faculty, image, top_rank, total_votes").eq("status", "active").order("total_votes", { ascending: false });
			if (error) {
				const { data: fallbackData, error: fallbackError } = await supabase.from("contestants").select("id, contestant_number, full_name, faculty, image, total_votes").eq("status", "active").order("total_votes", { ascending: false });
				if (fallbackError) throw fallbackError;
				return fallbackData ?? [];
			}
			return data ?? [];
		}
	});
}
function useStats() {
	return useQuery({
		queryKey: ["public-stats"],
		queryFn: async () => {
			const { data } = await supabase.rpc("public_stats");
			return data?.[0] ?? {
				total_contestants: 0,
				total_votes: 0,
				total_voters: 0
			};
		}
	});
}
function useSettings() {
	return useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
			return data;
		}
	});
}
function HomePage() {
	const featured = useFeatured();
	const stats = useStats();
	const settings = useSettings();
	const contestants = featured.data ?? [];
	const rankedTop3 = [
		1,
		2,
		3
	].map((rank) => contestants.find((c) => c.top_rank === rank)).filter((c) => Boolean(c));
	[...rankedTop3, ...contestants.filter((c) => !rankedTop3.some((ranked) => ranked.id === c.id))].slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero_default,
					alt: "",
					className: "h-full w-full object-cover object-top opacity-90",
					width: 1920,
					height: 1080
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-onyx/85 via-onyx/55 to-onyx/30" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl text-pearl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-gold/40 bg-onyx/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Season 2026 · Now Voting"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl",
							children: [settings.data?.competition_name ?? "MU Icons", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-gold-shine",
								children: "Beauty Pageant"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-xl text-lg text-pearl/85",
							children: "The crown is decided by you. Vote for your favourite contestant and shape the legacy of this year's MU Icon."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "gradient-gold text-onyx hover:opacity-90",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contestants",
									children: ["View Contestants ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
								})
							})
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-3",
				children: [
					{
						label: "Contestants",
						value: formatNumber(stats.data?.total_contestants),
						Icon: Users
					},
					{
						label: "Voting",
						value: "Open",
						Icon: Sparkles
					},
					{
						label: "Crown",
						value: "1",
						Icon: Crown
					}
				].map(({ label, value, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-2 px-4 py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-gold" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-3xl md:text-4xl",
							children: value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: label
						})
					]
				}, label))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/40 py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
							label: "The Lineup",
							title: "Featured Contestants"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "hidden md:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contestants",
								children: ["See all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
						children: (featured.data ?? []).slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContestantCard, { c }, c.id))
					}),
					(!featured.data || featured.data.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-center text-muted-foreground",
						children: "Contestants will appear here soon."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
					label: "The Process",
					title: "How Voting Works",
					centered: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-6 md:grid-cols-4",
					children: [
						{
							t: "Choose",
							d: "Pick your favourite contestant from the lineup."
						},
						{
							t: "Select Votes",
							d: `Each vote costs ${settings.data ? `₦${Number(settings.data.vote_price).toLocaleString()}` : "₦100"}. Buy as many as you like.`
						},
						{
							t: "Transfer",
							d: "Send the total amount via bank transfer to MU Icons."
						},
						{
							t: "Upload Proof",
							d: "Submit your receipt; votes are added once approved."
						}
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-card p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-full gradient-gold font-display text-lg text-onyx",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-xl",
								children: s.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: s.d
							})
						]
					}, s.t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap items-center justify-center gap-4 rounded-2xl gradient-onyx p-8 text-pearl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "All votes are verified by our admin team before being added to the live count."
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-card py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 text-center sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
						label: "Get in touch",
						title: "Contact MU Icons",
						centered: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-muted-foreground",
						children: "Questions about voting, sponsorship, or the competition? We'd love to hear from you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-3",
						children: [
							{
								t: "Email",
								v: "emmanueljaiyeola2@gmail.com"
							},
							{
								t: "Phone",
								v: "+2347016461677"
							},
							{
								t: "Tiktok",
								v: "@mui_icons"
							}
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-background p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-gold",
								children: x.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-medium",
								children: x.v
							})]
						}, x.t))
					})
				]
			})
		})
	] });
}
function Header({ label, title, centered }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: centered ? "text-center" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-gold" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-3 font-display text-4xl md:text-5xl",
			children: title
		})]
	});
}
//#endregion
export { HomePage as component };
