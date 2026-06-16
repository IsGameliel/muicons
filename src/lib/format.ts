export const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const formatNaira = (n: number | string | null | undefined) =>
  NGN.format(Number(n ?? 0));

export const formatNumber = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("en-US").format(Number(n ?? 0));

export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
