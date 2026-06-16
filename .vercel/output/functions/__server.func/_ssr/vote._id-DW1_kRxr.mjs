import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-aC9CX6Xo.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as LoaderCircle, P as Copy, R as CircleCheck, a as Upload, q as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as formatNaira } from "./format-DHr__noG.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as uploadFile, t as SignedImage } from "./SignedImage-DIrbBZmc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PublicLayout } from "./PublicLayout-DDZPYTmP.mjs";
import { t as Route } from "./vote._id-B4C0wBDu.mjs";
import { n as objectType, r as stringType, t as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vote._id-DW1_kRxr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	voter_name: stringType().trim().min(2, "Enter your full name").max(120),
	voter_email: stringType().trim().email("Invalid email").max(200),
	voter_phone: stringType().trim().min(7, "Enter your phone").max(30),
	votes: numberType().int().min(1).max(1e4)
});
function VotePage() {
	const { id } = Route.useParams();
	useNavigate();
	const [votes, setVotes] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)({
		voter_name: "",
		voter_email: "",
		voter_phone: ""
	});
	const [proof, setProof] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const contestant = useQuery({
		queryKey: ["contestant", id],
		queryFn: async () => {
			const { data } = await supabase.from("contestants").select("id, full_name, faculty, image, contestant_number").eq("id", id).maybeSingle();
			return data;
		}
	});
	const settings = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
			return data;
		}
	});
	const price = Number(settings.data?.vote_price ?? 100);
	const amount = (0, import_react.useMemo)(() => price * votes, [price, votes]);
	const votingOpen = settings.data?.voting_open ?? true;
	async function submit() {
		if (!votingOpen) return toast.error("Voting is currently closed.");
		if (!proof) return toast.error("Please upload your payment proof.");
		const parsed = schema.safeParse({
			...form,
			votes
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		setSubmitting(true);
		try {
			const path = await uploadFile("payment-proofs", proof, `${id}/`);
			const { error } = await supabase.from("transactions").insert({
				contestant_id: id,
				voter_name: form.voter_name.trim(),
				voter_email: form.voter_email.trim().toLowerCase(),
				voter_phone: form.voter_phone.trim(),
				number_of_votes: votes,
				amount,
				payment_proof: path
			});
			if (error) throw error;
			setDone(true);
			toast.success("Submission received — awaiting admin approval.");
		} catch (e) {
			console.error(e);
			toast.error("Could not submit. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}
	const c = contestant.data;
	const s = settings.data;
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-4 py-24 text-center sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-4xl",
				children: "Thank you!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted-foreground",
				children: [
					"Your payment is being verified. Votes will be added to ",
					c?.full_name,
					" once approved."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leaderboard",
						children: "View leaderboard"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "gradient-gold text-onyx",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contestants",
						children: "Back to contestants"
					})
				})]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-card border-b",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-6 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/contestants/$id",
					params: { id },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to profile"]
				})
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.25fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [c && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
					bucket: "contestant-photos",
					path: c.image,
					alt: c.full_name,
					className: "aspect-[3/4] w-full object-cover",
					fallbackClassName: "aspect-[3/4] w-full"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "gradient-gold text-onyx border-0",
							children: ["#", c.contestant_number]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl",
							children: c.full_name
						}),
						c.faculty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: c.faculty
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl gradient-onyx p-5 text-pearl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-gold",
						children: "You're voting for"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl",
							children: votes
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-pearl/80",
							children: "votes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl text-gold",
							children: formatNaira(amount)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-pearl/80",
							children: "total"
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 rounded-2xl border bg-card p-6 md:p-8",
			children: [
				!votingOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive",
					children: "Voting is currently closed. Please check back later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
					"Number of votes (",
					formatNaira(price),
					" each)"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [[
						1,
						5,
						10,
						25,
						50,
						100
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVotes(n),
						className: `rounded-lg border px-4 py-2 text-sm font-semibold transition ${votes === n ? "gradient-gold text-onyx border-transparent" : "hover:bg-accent"}`,
						children: n
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						value: votes,
						onChange: (e) => setVotes(Math.max(1, Number(e.target.value) || 1)),
						className: "w-28"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-secondary/40 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: "Transfer to:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-3 space-y-2 text-sm",
						children: [
							["Bank Name", s?.bank_name ?? "—"],
							["Account Name", s?.bank_account_name ?? "—"],
							["Account Number", s?.account_number ?? "—"],
							["Amount", formatNaira(amount)]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "flex items-center gap-2 font-medium",
								children: [v, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										navigator.clipboard.writeText(String(v));
										toast.success("Copied");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground" })
								})]
							})]
						}, k))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.voter_name,
								onChange: (e) => setForm({
									...form,
									voter_name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.voter_phone,
								onChange: (e) => setForm({
									...form,
									voter_phone: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email address",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: form.voter_email,
								onChange: (e) => setForm({
									...form,
									voter_email: e.target.value
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Upload payment proof" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background px-4 py-8 text-sm text-muted-foreground hover:border-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }),
						proof ? proof.name : "Click to upload receipt (JPG/PNG/PDF)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							className: "sr-only",
							accept: "image/*,application/pdf",
							onChange: (e) => setProof(e.target.files?.[0] ?? null)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					disabled: submitting || !votingOpen,
					size: "lg",
					className: "w-full gradient-gold text-onyx",
					children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Submitting…"] }) : `Submit Vote · ${formatNaira(amount)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Votes are added once your transfer is verified by an admin."
				})
			]
		})]
	})] });
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block",
			children: label
		}), children]
	});
}
//#endregion
export { VotePage as component };
