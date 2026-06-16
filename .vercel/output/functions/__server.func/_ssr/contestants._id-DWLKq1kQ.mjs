import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contestants._id-DWLKq1kQ.js
var $$splitComponentImporter = () => import("./contestants._id-Bu9f_WxM.mjs");
var Route = createFileRoute("/contestants/$id")({
	head: () => ({ meta: [{ title: "Contestant — MU Icons" }, {
		name: "description",
		content: "Contestant profile, biography, and voting page."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
