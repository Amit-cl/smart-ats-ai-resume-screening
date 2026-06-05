export default function ScoreBadge({ score }) {
  let style = "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300";

  if (score >= 75) style = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300";
  else if (score >= 50) style = "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style}`}>
      {score}%
    </span>
  );
}
