import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Heart, c as Star } from "../_libs/lucide-react.mjs";
import { r as formatNumber } from "./format-DHr__noG.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as SignedImage } from "./SignedImage-DPKDe6DI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ContestantCard-Wf2Bjp9e.js
var import_jsx_runtime = require_jsx_runtime();
function ContestantCard({ c, rank }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-luxe",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[3/4] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
					bucket: "contestant-photos",
					path: c.image,
					alt: c.full_name,
					className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
					fallbackClassName: "h-full w-full"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/10 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "absolute left-3 top-3 gradient-gold text-onyx border-0 font-semibold",
					children: ["#", c.contestant_number]
				}),
				rank && rank <= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-onyx/80 text-gold backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-gold" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 p-4 text-pearl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg leading-tight",
							children: c.full_name
						}),
						c.faculty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-pearl/70",
							children: c.faculty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-3.5 w-3.5 fill-rose text-rose" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [formatNumber(c.total_votes), " votes"]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contestants/$id",
					params: { id: c.id },
					children: "Profile"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				className: "flex-1 gradient-gold text-onyx",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/vote/$id",
					params: { id: c.id },
					children: "Vote"
				})
			})]
		})]
	});
}
//#endregion
export { ContestantCard as t };
