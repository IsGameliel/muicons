import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as LoaderCircle, N as Crown, d as ShieldCheck, i as UserCheck, z as CircleAlert } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Cn6Lj8oe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = import_react.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)(null);
	async function routeAfterAuth(opts) {
		const { data: userData } = await supabase.auth.getUser();
		const { data: roles } = await supabase.from("user_roles").select("role");
		const isAdmin = (roles ?? []).some((r) => r.role === "admin");
		const role = isAdmin ? "admin" : "user";
		if (opts?.announce) {
			setStatus({
				kind: "success",
				role,
				email: userData.user?.email ?? ""
			});
			toast.success(isAdmin ? "Signed in as Admin — redirecting to dashboard" : "Signed in — redirecting", { description: userData.user?.email ?? void 0 });
			await new Promise((r) => setTimeout(r, 900));
		}
		navigate({ to: isAdmin ? "/admin" : "/" });
	}
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) routeAfterAuth();
		});
	}, []);
	async function submit() {
		setLoading(true);
		setStatus(null);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name }
					}
				});
				if (error) throw error;
				toast.success("Account created. You're signed in!");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			await routeAfterAuth({ announce: true });
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Authentication failed";
			setStatus({
				kind: "error",
				message: msg
			});
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden gradient-onyx p-12 text-pearl md:flex md:flex-col md:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-7 w-7 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl",
						children: "MU Icons"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-5xl",
					children: "Crown your favourite."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-pearl/70",
					children: "Sign in to manage the MU Icons pageant, approve transactions, and grow the legend."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-pearl/40",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" MU Icons"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-4 py-10 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl",
								children: "MU Icons"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl",
						children: mode === "signin" ? "Welcome back" : "Create account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: mode === "signin" ? "Sign in to continue." : "Use admin@muicons.com to access the admin dashboard."
					})] }),
					status?.kind === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
						className: "border-gold/40 bg-gold/10",
						children: [
							status.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-gold" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: status.role === "admin" ? "Admin access granted" : "Signed in" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, { children: [
								status.email,
								" · role: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: status.role
								}),
								" — redirecting…"
							] })
						]
					}),
					status?.kind === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
						variant: "destructive",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Authentication failed" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: status.message })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: submit,
								disabled: loading,
								className: "w-full gradient-gold text-onyx",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : mode === "signin" ? "Sign in" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground",
						children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["New here? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "font-medium text-foreground underline",
							onClick: () => setMode("signup"),
							children: "Create an account"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Already a member? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "font-medium text-foreground underline",
							onClick: () => setMode("signin"),
							children: "Sign in"
						})] })
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
