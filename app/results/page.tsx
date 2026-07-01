import { Suspense } from "react";
import { calculateRisk, getLevelColor, getLevelBg } from "../lib/risk";
import { getStories } from "../lib/data";
import { ResultsClient } from "./results-client";

async function ResultsContent({ params }: { params: { [key: string]: string } }) {
  const [risk, stories] = await Promise.all([
    calculateRisk(params.make, params.model, params.year, params.province),
    getStories(),
  ]);
  return (
    <ResultsClient
      risk={risk}
      levelColor={getLevelColor(risk.level)}
      levelBg={getLevelBg(risk.level)}
      stories={stories}
    />
  );
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const params = {
    make: String(sp.make ?? "Toyota"),
    model: String(sp.model ?? "Hilux"),
    year: String(sp.year ?? "2024"),
    province: String(sp.province ?? "Gauteng"),
  };

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)" }}>Loading results...</div>}>
      <ResultsContent params={params} />
    </Suspense>
  );
}
