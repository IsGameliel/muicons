import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as LoaderCircle, a as Upload, g as Plus, s as Trash2, v as Pencil } from "../_libs/lucide-react.mjs";
import { r as formatNumber } from "./format-DHr__noG.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-CzUx__WV.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as uploadFile, t as SignedImage } from "./SignedImage-DPKDe6DI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.contestants-C0ObeAd_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var empty = {
	contestant_number: 1,
	full_name: "",
	faculty: "",
	biography: "",
	image: null,
	status: "active"
};
function AdminContestants() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [savingRank, setSavingRank] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-contestants"],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("*").order("contestant_number");
			return data ?? [];
		}
	});
	async function save() {
		if (!editing) return;
		setSaving(true);
		try {
			let imagePath = editing.image;
			if (file) imagePath = await uploadFile("contestant-photos", file, "");
			const payload = {
				contestant_number: editing.contestant_number,
				full_name: editing.full_name.trim(),
				faculty: editing.faculty.trim() || null,
				biography: editing.biography.trim() || null,
				image: imagePath,
				status: editing.status
			};
			if (editing.id) {
				const { error } = await supabase.from("contestants").update(payload).eq("id", editing.id);
				if (error) throw error;
				toast.success("Contestant updated");
			} else {
				const { error } = await supabase.from("contestants").insert(payload);
				if (error) throw error;
				toast.success("Contestant added");
			}
			setEditing(null);
			setFile(null);
			qc.invalidateQueries({ queryKey: ["admin-contestants"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	async function remove(id) {
		if (!confirm("Delete this contestant? This cannot be undone.")) return;
		const { error } = await supabase.from("contestants").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin-contestants"] });
		}
	}
	async function toggleStatus(c) {
		const status = c.status === "active" ? "inactive" : "active";
		const { error } = await supabase.from("contestants").update({ status }).eq("id", c.id);
		if (error) toast.error(error.message);
		else qc.invalidateQueries({ queryKey: ["admin-contestants"] });
	}
	async function setTopRank(rank, contestantId) {
		setSavingRank(rank);
		try {
			if (contestantId === "none") {
				const { error } = await supabase.from("contestants").update({ top_rank: null }).eq("top_rank", rank);
				if (error) throw error;
			} else {
				const { error: clearError } = await supabase.from("contestants").update({ top_rank: null }).or(`top_rank.eq.${rank},id.eq.${contestantId}`);
				if (clearError) throw clearError;
				const { error } = await supabase.from("contestants").update({ top_rank: rank }).eq("id", contestantId);
				if (error) throw error;
			}
			toast.success(`Top ${rank} updated`);
			qc.invalidateQueries();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not update Top 3");
		} finally {
			setSavingRank(null);
		}
	}
	const nextNumber = Math.max(0, ...(data ?? []).map((c) => c.contestant_number)) + 1;
	const activeContestants = (data ?? []).filter((c) => c.status === "active");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Contestants"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage the lineup, photos, and active status."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing({
							...empty,
							contestant_number: nextNumber
						});
						setFile(null);
					},
					className: "gradient-gold text-onyx",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add contestant"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Top 3 Contestants"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Choose who appears in the homepage Top 3 section."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Homepage"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 md:grid-cols-3",
					children: [
						1,
						2,
						3
					].map((rank) => {
						const selected = activeContestants.find((c) => c.top_rank === rank)?.id ?? "none";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: [
								"1st Place",
								"2nd Place",
								"3rd Place"
							][rank - 1] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selected,
								onValueChange: (value) => setTopRank(rank, value),
								disabled: savingRank !== null,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "Automatic by votes"
								}), activeContestants.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										"#",
										c.contestant_number,
										" - ",
										c.full_name
									]
								}, c.id))] })]
							}),
							savingRank === rank && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Saving..."
							})
						] }, rank);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground",
					children: "Loading…"
				}), (data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[3/4]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
								bucket: "contestant-photos",
								path: c.image,
								alt: c.full_name,
								className: "h-full w-full object-cover",
								fallbackClassName: "h-full w-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "absolute left-2 top-2 gradient-gold text-onyx border-0",
								children: ["#", c.contestant_number]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: c.status === "active" ? "default" : "secondary",
								className: "absolute right-2 top-2",
								children: c.status
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-display text-lg",
								children: c.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: c.faculty ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatNumber(c.total_votes), " votes"] }), c.top_rank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: ["Top ", c.top_rank]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: c.status === "active",
										onCheckedChange: () => toggleStatus(c)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => {
											setEditing(c);
											setFile(null);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => remove(c.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})]
								})]
							})
						]
					})]
				}, c.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing?.id ? "Edit" : "Add", " contestant"] }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contestant #" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: editing.contestant_number,
										onChange: (e) => setEditing({
											...editing,
											contestant_number: Number(e.target.value)
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: editing.status === "active",
											onCheckedChange: (v) => setEditing({
												...editing,
												status: v ? "active" : "inactive"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: editing.status
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing.full_name,
									onChange: (e) => setEditing({
										...editing,
										full_name: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Faculty / Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing.faculty,
									onChange: (e) => setEditing({
										...editing,
										faculty: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Biography" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 4,
									value: editing.biography,
									onChange: (e) => setEditing({
										...editing,
										biography: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-2 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-gold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
										file ? file.name : editing.image ? "Replace photo" : "Upload photo",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "sr-only",
											onChange: (e) => setFile(e.target.files?.[0] ?? null)
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setEditing(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: save,
							disabled: saving,
							className: "gradient-gold text-onyx",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Save"]
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { AdminContestants as component };
