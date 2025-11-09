import { Recommendation } from "@/app/types/recommendation";

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const res = await fetch("/api/recommendations");
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function updateRecommendation(id: string, data: Partial<Recommendation>) {
  await fetch("/api/recommendations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
}
