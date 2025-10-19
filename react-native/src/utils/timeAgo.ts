export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // segundos
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let unit: Intl.RelativeTimeFormatUnit = "second";
  let value = diff;

  for (const [amount, nextUnit] of units) {
    if (Math.abs(value) < amount) break;
    value /= amount;
    unit = nextUnit;
  }

  return rtf.format(-Math.floor(value), unit);
}
