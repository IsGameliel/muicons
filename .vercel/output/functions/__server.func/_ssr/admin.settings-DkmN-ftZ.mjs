import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DkmN-ftZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data } = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (data && !form) setForm(data);
	}, [data, form]);
	async function save() {
		if (!form) return;
		setSaving(true);
		const { error } = await supabase.from("settings").update({
			competition_name: form.competition_name,
			voting_open: form.voting_open,
			bank_account_name: form.bank_account_name,
			bank_name: form.bank_name,
			account_number: form.account_number,
			vote_price: form.vote_price
		}).eq("id", 1);
		setSaving(false);
		if (error) toast.error(error.message);
		else {
			toast.success("Settings saved");
			qc.invalidateQueries({ queryKey: ["settings"] });
		}
	}
	if (!form) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Configure the competition and bank details."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Competition",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Competition name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.competition_name,
							onChange: (e) => setForm({
								...form,
								competition_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Voting open" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "When off, no new submissions are accepted."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: form.voting_open,
							onCheckedChange: (v) => setForm({
								...form,
								voting_open: v
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price per vote (₦)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: form.vote_price,
							onChange: (e) => setForm({
								...form,
								vote_price: Number(e.target.value)
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Bank account",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bank name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.bank_name,
							onChange: (e) => setForm({
								...form,
								bank_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Account name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.bank_account_name,
							onChange: (e) => setForm({
								...form,
								bank_account_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Account number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.account_number,
							onChange: (e) => setForm({
								...form,
								account_number: e.target.value
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "gradient-gold text-onyx",
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Save changes"]
				})
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-4",
			children
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-1.5 block",
		children: label
	}), children] });
}
//#endregion
export { AdminSettings as component };
