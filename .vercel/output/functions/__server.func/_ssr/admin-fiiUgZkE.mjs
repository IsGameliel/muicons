import { t as supabase } from "./client-CKv989Sf.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useIsAdmin, t as useAuth } from "./use-auth-CHUZ-fsO.mjs";
import { _ as useRouter, d as Outlet, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Crown, S as LogOut, W as ChartColumn, f as Settings, h as Receipt, j as ExternalLink, n as Users, r as UserCog, w as LayoutDashboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-fiiUgZkE.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/admin",
		label: "Dashboard",
		Icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/contestants",
		label: "Contestants",
		Icon: Users
	},
	{
		to: "/admin/transactions",
		label: "Transactions",
		Icon: Receipt
	},
	{
		to: "/admin/users",
		label: "Users",
		Icon: UserCog
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		Icon: ChartColumn
	},
	{
		to: "/admin/settings",
		label: "Settings",
		Icon: Settings
	}
];
function AdminShell({ children }) {
	const { user } = useAuth();
	const { data: isAdmin, isLoading } = useIsAdmin(user?.id);
	const router = useRouter();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-muted-foreground",
		children: "Checking access…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "mx-auto h-12 w-12 text-gold" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl",
					children: "Admin only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Sign in with the admin email (admin@muicons.com) to access this dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Home"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "gradient-gold text-onyx",
						onClick: async () => {
							await supabase.auth.signOut();
							router.invalidate();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Switch account"
						})
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen md:grid-cols-[260px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden gradient-onyx p-4 text-pearl md:flex md:flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "flex items-center gap-2 px-2 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: "MU Icons"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-4 flex-1 space-y-1",
					children: nav.map(({ to, label, Icon, exact }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						activeOptions: { exact: !!exact },
						className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-pearl/75 transition hover:bg-pearl/10 hover:text-pearl",
						activeProps: { className: "bg-pearl/10 text-pearl" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
							" ",
							label
						]
					}, to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto space-y-1 border-t border-pearl/10 pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-pearl/70 hover:bg-pearl/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " View site"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								await supabase.auth.signOut();
								router.invalidate();
							},
							className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-pearl/70 hover:bg-pearl/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-2 text-xs text-pearl/40 truncate",
							children: user?.email
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b bg-card px-4 py-3 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:hidden flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg",
								children: "MU Icons"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block text-sm text-muted-foreground",
							children: "Admin Console"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "View site"
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-b bg-card px-2 py-2 md:hidden overflow-x-auto scrollbar-thin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: nav.map(({ to, label, Icon, exact }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							activeOptions: { exact: !!exact },
							className: "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground",
							activeProps: { className: "bg-accent text-foreground" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
								" ",
								label
							]
						}, to))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 md:p-8",
					children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
