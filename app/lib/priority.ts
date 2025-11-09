import { Recommendation } from "@/app/types/recommendation";

export const isHighImpact = (item: Recommendation): boolean => item.impactScore >= 80;

export const isQuickTurnaround = (item: Recommendation): boolean => item.estimatedTimeHours <= 2;

