//#region node_modules/.nitro/vite/services/ssr/assets/format-DHr__noG.js
var NGN = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0
});
var formatNaira = (n) => NGN.format(Number(n ?? 0));
var formatNumber = (n) => new Intl.NumberFormat("en-US").format(Number(n ?? 0));
function formatDate(d) {
	return new Date(d).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
//#endregion
export { formatNaira as n, formatNumber as r, formatDate as t };
