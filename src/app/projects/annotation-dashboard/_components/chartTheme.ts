export const CHART_COLORS = [
  "#1FB8CD","#FFC185","#B4413C","#5D878F",
  "#D2BA4C","#DB4545","#ECEBD5","#964325",
];
export const CHART_THEME = {
  light: { grid:"#e5e7eb", text:"#374151", tooltip:{bg:"#ffffff",border:"#e5e7eb",text:"#111827"} },
  dark:  { grid:"#374151", text:"#d1d5db", tooltip:{bg:"#1f2937",border:"#374151",text:"#f9fafb"} },
};
export const SEVERITY_CLASSES: Record<string,string> = {
  high:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ok:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};
