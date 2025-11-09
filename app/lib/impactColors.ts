export type ImpactColorClasses = {
  trackClass: string;
  fillClass: string;
};

export const getImpactColorClasses = (score: number): ImpactColorClasses => {
  if (score >= 80) {
    return { trackClass: "text-emerald-100", fillClass: "text-emerald-500" };
  }

  if (score >= 65) {
    return { trackClass: "text-sky-100", fillClass: "text-sky-500" };
  }

  return { trackClass: "text-slate-200", fillClass: "text-slate-500" };
};

