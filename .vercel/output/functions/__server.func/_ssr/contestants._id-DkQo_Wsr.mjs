import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contestants._id-DkQo_Wsr.js
var $$splitComponentImporter = () => import("./contestants._id-B1uVgho9.mjs");
var Route = createFileRoute("/contestants/$id")({
	head: () => ({ meta: [{ title: "Contestant — MU Icons" }, {
		name: "description",
		content: "Contestant profile, biography, and live vote count."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
