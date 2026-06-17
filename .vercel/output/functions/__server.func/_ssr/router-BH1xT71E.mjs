import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, k as redirect, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$13 } from "./contestants._id-CEsaHYS3.mjs";
import { t as Route$14 } from "./vote._id-BohwghRw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BH1xT71E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-z31ZTSPv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl text-gold-shine",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md gradient-gold px-4 py-2 text-sm font-semibold text-onyx",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try again or head home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md gradient-gold px-4 py-2 text-sm font-semibold text-onyx",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border px-4 py-2 text-sm",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MU Icons — University Beauty Pageant Voting" },
			{
				name: "description",
				content: "Vote for your favourite contestant in the MU Icons beauty pageant. Live leaderboard, transparent voting, premium experience."
			},
			{
				property: "og:title",
				content: "MU Icons — Crown Your Favourite"
			},
			{
				property: "og:description",
				content: "Premier university beauty pageant voting platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
				router.invalidate();
				if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			}
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-center"
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./leaderboard-DASr1pRB.mjs");
var Route$11 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [
		{ title: "Leaderboard — MU Icons" },
		{
			name: "description",
			content: "Live ranking of the top contestants in the MU Icons pageant."
		},
		{
			property: "og:title",
			content: "Live Leaderboard — MU Icons"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./contestants-zBoVvPGF.mjs");
var Route$10 = createFileRoute("/contestants")({
	head: () => ({ meta: [
		{ title: "Contestants — MU Icons" },
		{
			name: "description",
			content: "Browse all contestants. Search, filter, and cast your votes."
		},
		{
			property: "og:title",
			content: "All Contestants — MU Icons"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./auth-Cn6Lj8oe.mjs");
var Route$9 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — MU Icons" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./route-Di7iQBCH.mjs");
var Route$8 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./routes-4Uype92a.mjs");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "MU Icons — University Beauty Pageant" },
		{
			name: "description",
			content: "Cast your vote for the next MU Icon. Premium beauty pageant voting platform with live leaderboard."
		},
		{
			property: "og:title",
			content: "MU Icons — Crown Your Favourite"
		},
		{
			property: "og:description",
			content: "Live voting, real-time leaderboard, premium pageant experience."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin-fiiUgZkE.mjs");
var Route$6 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.index-Bun5b43j.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.users-Dgn0JTkI.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.transactions-CTOaE60K.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/transactions")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.settings-DkmN-ftZ.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.contestants-C0ObeAd_.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/contestants")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.analytics-YRbIP-0k.mjs");
var Route = createFileRoute("/_authenticated/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var LeaderboardRoute = Route$11.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => Route$12
});
var ContestantsRoute = Route$10.update({
	id: "/contestants",
	path: "/contestants",
	getParentRoute: () => Route$12
});
var AuthRoute = Route$9.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$12
});
var AuthenticatedRouteRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$12
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var VoteIdRoute = Route$14.update({
	id: "/vote/$id",
	path: "/vote/$id",
	getParentRoute: () => Route$12
});
var ContestantsIdRoute = Route$13.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ContestantsRoute
});
var AuthenticatedAdminRoute = Route$6.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminUsersRoute = Route$4.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminTransactionsRoute = Route$3.update({
	id: "/transactions",
	path: "/transactions",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminSettingsRoute = Route$2.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminContestantsRoute = Route$1.update({
	id: "/contestants",
	path: "/contestants",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminAnalyticsRoute: Route.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => AuthenticatedAdminRoute
	}),
	AuthenticatedAdminContestantsRoute,
	AuthenticatedAdminSettingsRoute,
	AuthenticatedAdminTransactionsRoute,
	AuthenticatedAdminUsersRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = { AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren) };
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var ContestantsRouteChildren = { ContestantsIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AuthRoute,
	ContestantsRoute: ContestantsRoute._addFileChildren(ContestantsRouteChildren),
	LeaderboardRoute,
	VoteIdRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
