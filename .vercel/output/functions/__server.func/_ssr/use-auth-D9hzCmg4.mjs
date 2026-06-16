import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-aC9CX6Xo.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-D9hzCmg4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user: session?.user ?? null,
		loading
	};
}
function useIsAdmin(userId) {
	return useQuery({
		queryKey: ["is_admin", userId],
		enabled: !!userId,
		queryFn: async () => {
			if (!userId) return false;
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
			if (error) return false;
			return !!data;
		}
	});
}
//#endregion
export { useIsAdmin as n, useAuth as t };
