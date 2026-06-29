import { Suspense } from "react";
import { calculateRisk, generateStories, getLevelColor, getLevelBg } from "../lib/risk";
import { ResultsClient } from "./results-client";

async function ResultsContent({ params }: { params: { [key: string]: string } }) {
  const make = params.make || "Toyota";
  const model = params.model || "Hilux";
  const year = params.year || "2024";
  const province = params.province || "Gauteng";

  const risk = await calculateRisk(make, model, year, province);
  const stories = generateStories(make, model, province);

  return (
    <ResultsClient
      risk={risk}
      stories={stories}
      levelColor={getLevelColor(risk.level)}
      levelBg={getLevelBg(risk.level)}
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
