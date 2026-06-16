import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CKv989Sf.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SignedImage-DPKDe6DI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Get a signed URL for a private storage object. Returns "" on failure. */
async function getSignedUrl(bucket, path, expiresIn = 3600 * 24 * 7) {
	if (!path) return "";
	if (path.startsWith("http")) return path;
	const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
	return data?.signedUrl ?? "";
}
async function uploadFile(bucket, file, pathPrefix = "") {
	const ext = file.name.split(".").pop() || "bin";
	const name = `${pathPrefix}${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage.from(bucket).upload(name, file, {
		cacheControl: "3600",
		upsert: false
	});
	if (error) throw error;
	return name;
}
function SignedImage({ bucket, path, alt, className, fallbackClassName }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let active = true;
		getSignedUrl(bucket, path).then((u) => active && setUrl(u));
		return () => {
			active = false;
		};
	}, [bucket, path]);
	if (!path || !url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center justify-center bg-gradient-to-br from-accent/40 to-secondary/40 text-muted-foreground text-xs", fallbackClassName ?? className),
		children: path ? "Loading…" : "No photo"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt,
		className,
		loading: "lazy"
	});
}
//#endregion
export { uploadFile as n, SignedImage as t };
