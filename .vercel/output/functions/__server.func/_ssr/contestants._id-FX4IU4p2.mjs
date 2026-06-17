import { t as supabase } from "./client-CKv989Sf.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as notFound, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Heart, o as Trophy, q as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as SignedImage } from "./SignedImage-DPKDe6DI.mjs";
import { t as PublicLayout } from "./PublicLayout-DHu92M1d.mjs";
import { t as Route } from "./contestants._id-CEsaHYS3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contestants._id-FX4IU4p2.js
var import_jsx_runtime = require_jsx_runtime();
function ContestantProfile() {
	const { id } = Route.useParams();
	const { data: c, isLoading } = useQuery({
		queryKey: ["contestant", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("contestants").select("*").eq("id", id).maybeSingle();
			if (error) throw error;
			if (!data) throw notFound();
			return data;
		}
	});
	const { data: rank } = useQuery({
		queryKey: [
			"contestant-rank",
			id,
			c?.total_votes
		],
		enabled: !!c,
		queryFn: async () => {
			const { count } = await supabase.from("contestants").select("id", {
				count: "exact",
				head: true
			}).gt("total_votes", c.total_votes);
			return (count ?? 0) + 1;
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-32 text-center text-muted-foreground",
		children: "Loading…"
	}) });
	if (!c) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-card border-b",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-4 py-6 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/contestants",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), " All contestants"]
				})
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl border shadow-luxe",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
					bucket: "contestant-photos",
					path: c.image,
					alt: c.full_name,
					className: "aspect-[3/4] w-full object-cover",
					fallbackClassName: "aspect-[3/4] w-full"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "gradient-gold text-onyx border-0",
					children: ["Contestant #", c.contestant_number]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-5xl md:text-6xl",
					children: c.full_name
				}),
				c.faculty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-lg text-muted-foreground",
					children: c.faculty
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid max-w-sm gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs uppercase tracking-widest text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " Current Rank"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 font-display text-4xl",
							children: ["#", rank ?? "—"]
						})]
					})
				}),
				c.biography && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Biography"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 whitespace-pre-line leading-relaxed text-muted-foreground",
						children: c.biography
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "gradient-gold text-onyx",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vote/$id",
							params: { id: c.id },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mr-2 h-4 w-4" }),
								" Vote for ",
								c.full_name.split(" ")[0]
							]
						})
					})
				})
			] })]
		})
	})] });
}
//#endregion
export { ContestantProfile as component };
