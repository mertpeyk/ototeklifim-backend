import type { ValuationEstimateInput } from './valuation.js';

type MarketCompListing = {
  source: 'arabam' | 'sahibinden';
  id: number | null;
  title: string;
  price: number;
  formattedPrice: string;
  categoryName: string;
  variant: string;
  url?: string;
  year?: number | null;
  approxKm?: number | null;
  relevanceScore?: number;
  comparisonWeight?: number;
  adjustedPrice?: number;
};

type MarketCompStats = {
  min: number;
  max: number;
  median: number;
  average: number;
  trimmedAverage: number;
  lowerBand: number;
  upperBand: number;
};

type MarketCompsPayload = {
  sampleSize: number;
  stats: MarketCompStats | null;
  listings: MarketCompListing[];
};

type ValuationIntelligenceArgs = {
  input: ValuationEstimateInput;
  heuristicEstimate: number;
  marketComps: MarketCompsPayload | null;
  severityScore: number;
  demand: string;
};

type ParsedSignals = {
  positives: string[];
  negatives: string[];
  riskFlags: string[];
};

type IntelligenceListing = MarketCompListing & {
  similarityScore: number;
  similarityReason: string;
};

type OpenAiRefinement = {
  perListing: Array<{
    index: number;
    similarityScore: number;
    note: string;
  }>;
  reviewRecommendation: 'approve' | 'manual_review';
  reviewReason: string;
  explanation: string;
  adjustmentPercent: number;
};

export type ValuationIntelligenceResult = {
  provider: 'deterministic' | 'openai' | 'hybrid';
  aiEnabled: boolean;
  averageSimilarity: number;
  filteredListings: IntelligenceListing[];
  filteredStats: MarketCompStats | null;
  reviewRecommendation: 'approve' | 'manual_review';
  reviewReason: string;
  explanation: string;
  adjustmentPercent: number;
  parsedSignals: ParsedSignals;
};

function normalizeText(value: string | undefined) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value: string | undefined) {
  return normalizeText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);
}

function weightedAverage(values: Array<{ value: number; weight: number }>) {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  return values.reduce((sum, item) => sum + (item.value * item.weight), 0) / totalWeight;
}

function weightedQuantile(values: Array<{ value: number; weight: number }>, ratio: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left.value - right.value);
  const totalWeight = sorted.reduce((sum, item) => sum + item.weight, 0);
  const target = totalWeight * Math.max(0, Math.min(1, ratio));
  let running = 0;

  for (const item of sorted) {
    running += item.weight;
    if (running >= target) {
      return item.value;
    }
  }

  return sorted[sorted.length - 1]!.value;
}

function buildStats(listings: IntelligenceListing[]) {
  if (!listings.length) return null;

  const weightedValues = listings.map((item) => ({
    value: item.adjustedPrice || item.price,
    weight: Math.max(0.3, (item.comparisonWeight || 1) * Math.max(0.45, item.similarityScore / 100)),
  }));
  const sorted = [...weightedValues].sort((left, right) => left.value - right.value);
  const weightedMedianValue = weightedQuantile(sorted, 0.5);
  const lowerFence = weightedMedianValue * 0.84;
  const upperFence = weightedMedianValue * 1.16;
  const trimmed = sorted.filter((item) => item.value >= lowerFence && item.value <= upperFence);
  const trimmedValues = trimmed.length >= 3 ? trimmed : sorted;

  return {
    min: Math.round(sorted[0]!.value),
    max: Math.round(sorted[sorted.length - 1]!.value),
    median: Math.round(weightedMedianValue),
    average: Math.round(weightedAverage(sorted)),
    trimmedAverage: Math.round(weightedAverage(trimmedValues)),
    lowerBand: Math.round(weightedQuantile(trimmedValues, 0.18)),
    upperBand: Math.round(weightedQuantile(trimmedValues, 0.82)),
  };
}

function scoreTokenOverlap(left: string | undefined, right: string | undefined) {
  const leftTokens = tokenize(left);
  const rightTokens = tokenize(right);
  if (!leftTokens.length || !rightTokens.length) return 0;
  const rightSet = new Set(rightTokens);
  const matches = leftTokens.filter((token) => rightSet.has(token)).length;
  return matches / Math.max(leftTokens.length, rightTokens.length);
}

function parseTextSignals(input: ValuationEstimateInput): ParsedSignals {
  const combined = normalizeText([
    input.condition.mechanicalStatus,
    input.condition.maintenanceHistory,
    input.condition.appraisalReport || '',
    input.vehicleInfo.packageName,
  ].join(' '));

  const positives: string[] = [];
  const negatives: string[] = [];
  const riskFlags: string[] = [];

  if (combined.includes('yetkili servis') || combined.includes('servis kayitli')) {
    positives.push('Bakım geçmişi kayıtlı görünüyor');
  }
  if (combined.includes('ekspertiz') && (combined.includes('temiz') || combined.includes('sorun yok'))) {
    positives.push('Ekspertiz anlatımı güven veriyor');
  }
  if (combined.includes('tramer') || combined.includes('hasar kaydi')) {
    negatives.push('Serbest metinde hasar/tramer vurgusu var');
  }
  if (combined.includes('boya') || combined.includes('degisen')) {
    negatives.push('Serbest metinde boya/değişen riski geçiyor');
  }
  if (combined.includes('airbag') && (combined.includes('acik') || combined.includes('patlak') || combined.includes('islem'))) {
    riskFlags.push('Airbag tarafında metinsel risk sinyali var');
  }
  if (combined.includes('sase') || combined.includes('podye') || combined.includes('direk')) {
    if (combined.includes('islem') || combined.includes('hasar') || combined.includes('duzeltme')) {
      riskFlags.push('Şase/Podye/Direk tarafında metinsel risk sinyali var');
    }
  }

  return { positives, negatives, riskFlags };
}

function scoreComparableListing(input: ValuationEstimateInput, listing: MarketCompListing): IntelligenceListing {
  const title = `${listing.title} ${listing.variant} ${listing.categoryName}`;
  const normalizedTitle = normalizeText(title);
  const targetYear = Number(input.vehicleInfo.year || 0);
  const targetKm = Number(input.vehicleInfo.mileage || 0);
  const listingYear = Number(listing.year || 0);
  const listingKm = Number(listing.approxKm || 0);
  const reasons: string[] = [];
  let score = 40;

  if (normalizedTitle.includes(normalizeText(input.vehicleInfo.brand))) {
    score += 12;
    reasons.push('marka uyumu');
  }
  if (normalizedTitle.includes(normalizeText(input.vehicleInfo.model))) {
    score += 16;
    reasons.push('model uyumu');
  }

  const engineOverlap = scoreTokenOverlap(input.vehicleInfo.engineVolume, title);
  if (engineOverlap > 0.3) {
    score += Math.round(engineOverlap * 18);
    reasons.push('motor yakın');
  }

  const packageOverlap = scoreTokenOverlap(input.vehicleInfo.packageName, title);
  if (packageOverlap > 0.3) {
    score += Math.round(packageOverlap * 12);
    reasons.push('paket yakın');
  }

  if (normalizedTitle.includes(normalizeText(input.vehicleInfo.fuelType))) {
    score += 8;
    reasons.push('yakıt uyumu');
  }
  if (normalizedTitle.includes(normalizeText(input.vehicleInfo.transmission))) {
    score += 8;
    reasons.push('şanzıman uyumu');
  }
  if (normalizedTitle.includes(normalizeText(input.vehicleInfo.bodyType))) {
    score += 6;
    reasons.push('kasa uyumu');
  }

  if (listingYear) {
    const diff = Math.abs(targetYear - listingYear);
    if (diff === 0) score += 12;
    else if (diff === 1) score += 8;
    else if (diff === 2) score += 4;
    else score -= Math.min(18, diff * 4);
  }

  if (listingKm && targetKm) {
    const kmDiffRatio = Math.abs(targetKm - listingKm) / Math.max(targetKm, 1);
    if (kmDiffRatio <= 0.1) score += 10;
    else if (kmDiffRatio <= 0.2) score += 6;
    else if (kmDiffRatio <= 0.35) score += 2;
    else score -= Math.min(14, Math.round(kmDiffRatio * 20));
  }

  return {
    ...listing,
    similarityScore: Math.max(0, Math.min(100, score)),
    similarityReason: reasons.length ? reasons.join(', ') : 'genel pazar benzerliği',
  };
}

function buildPrompt(args: ValuationIntelligenceArgs, listings: IntelligenceListing[]) {
  return {
    vehicle: args.input.vehicleInfo,
    condition: args.input.condition,
    heuristicEstimate: Math.round(args.heuristicEstimate),
    severityScore: args.severityScore,
    demand: args.demand,
    listings: listings.map((item, index) => ({
      index,
      title: item.title,
      variant: item.variant,
      price: item.price,
      adjustedPrice: item.adjustedPrice || item.price,
      year: item.year ?? null,
      approxKm: item.approxKm ?? null,
      deterministicSimilarity: item.similarityScore,
      deterministicReason: item.similarityReason,
    })),
  };
}

async function refineWithOpenAi(args: ValuationIntelligenceArgs, listings: IntelligenceListing[]): Promise<OpenAiRefinement | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_VALUATION_MODEL || 'gpt-4.1-mini';
  const payload = buildPrompt(args, listings.slice(0, 6));

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a used-car valuation copilot. Score comparable listings for similarity when available, evaluate vehicle-condition signals, suggest a cautious pricing adjustment, and give a concise Turkish explanation. Return strict JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              task: 'If comparable listings exist, score listing similarity from 0 to 100. If listings are missing or weak, still evaluate the vehicle and condition payload conservatively. Recommend approve or manual_review, provide a short Turkish reason, a concise Turkish explanation, and a safe adjustmentPercent between -6 and 6. Use small adjustments unless the condition/package/risk signals clearly justify otherwise.',
              payload,
              schema: {
                perListing: [{ index: 0, similarityScore: 76, note: 'trim and engine close match' }],
                reviewRecommendation: 'approve',
                reviewReason: 'string',
                explanation: 'string',
                adjustmentPercent: 0,
              },
            }),
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const json = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as Partial<OpenAiRefinement> & {
      perListing?: OpenAiRefinement['perListing'];
    };
    if (!parsed.reviewRecommendation || !parsed.reviewReason || !parsed.explanation) {
      return null;
    }

    return {
      perListing: (Array.isArray(parsed.perListing) ? parsed.perListing : []).map((item) => ({
        index: Number(item.index || 0),
        similarityScore: Math.max(0, Math.min(100, Number(item.similarityScore || 0))),
        note: String(item.note || '').trim(),
      })),
      reviewRecommendation: parsed.reviewRecommendation === 'manual_review' ? 'manual_review' : 'approve',
      reviewReason: String(parsed.reviewReason || '').trim(),
      explanation: String(parsed.explanation || '').trim(),
      adjustmentPercent: Math.max(-6, Math.min(6, Number(parsed.adjustmentPercent || 0))),
    };
  } catch {
    return null;
  }
}

export async function runValuationIntelligence(args: ValuationIntelligenceArgs): Promise<ValuationIntelligenceResult> {
  const parsedSignals = parseTextSignals(args.input);
  const baseListings = (args.marketComps?.listings || []).map((item) => scoreComparableListing(args.input, item));
  const openAiRefinement = await refineWithOpenAi(args, baseListings);

  let listings = baseListings;
  let provider: ValuationIntelligenceResult['provider'] = 'deterministic';
  let adjustmentPercent = 0;
  let reviewRecommendation: ValuationIntelligenceResult['reviewRecommendation'] = 'approve';
  let reviewReason = '';
  let explanation = '';

  if (openAiRefinement) {
    provider = baseListings.length ? 'hybrid' : 'openai';
    const aiMap = new Map(openAiRefinement.perListing.map((item) => [item.index, item]));
    listings = baseListings.map((item, index) => {
      const ai = aiMap.get(index);
      if (!ai) return item;
      const blendedScore = Math.round((item.similarityScore * 0.7) + (ai.similarityScore * 0.3));
      return {
        ...item,
        similarityScore: Math.max(0, Math.min(100, blendedScore)),
        similarityReason: ai.note || item.similarityReason,
      };
    });
    adjustmentPercent = openAiRefinement.adjustmentPercent;
    reviewRecommendation = openAiRefinement.reviewRecommendation;
    reviewReason = openAiRefinement.reviewReason;
    explanation = openAiRefinement.explanation;
  }

  const filteredListings = listings
    .filter((item) => item.similarityScore >= 60)
    .sort((left, right) => right.similarityScore - left.similarityScore || (right.comparisonWeight || 0) - (left.comparisonWeight || 0))
    .slice(0, 10);
  const averageSimilarity = filteredListings.length
    ? Math.round(filteredListings.reduce((sum, item) => sum + item.similarityScore, 0) / filteredListings.length)
    : 0;
  const filteredStats = buildStats(filteredListings);

  if (!reviewReason) {
    if (filteredListings.length < 3 && !openAiRefinement) {
      reviewRecommendation = 'manual_review';
      reviewReason = 'AI katmanı yeterince benzer emsal bulamadı';
    } else if (averageSimilarity < 68) {
      reviewRecommendation = 'manual_review';
      reviewReason = 'Emsaller var ama benzerlik gücü düşük';
    } else if (!filteredListings.length && openAiRefinement) {
      reviewRecommendation = args.severityScore >= 5 || parsedSignals.riskFlags.length ? 'manual_review' : 'approve';
      reviewReason = reviewRecommendation === 'manual_review'
        ? 'AI düzeltmesi uygulandı ama kondisyon riski uzman kontrolü gerektiriyor'
        : 'AI düzeltmesi sınırlı veriyle kontrollü şekilde uygulandı';
    } else if (args.severityScore >= 5 || parsedSignals.riskFlags.length) {
      reviewRecommendation = 'manual_review';
      reviewReason = 'Kondisyon ve risk sinyalleri uzman kontrolü gerektiriyor';
    } else {
      reviewRecommendation = 'approve';
      reviewReason = 'Emsal kalitesi yeterli görünüyor';
    }
  }

  if (!explanation) {
    explanation = [
      filteredListings.length >= 3
        ? `${filteredListings.length} güçlü emsal AI benzerlik skoru ile seçildi`
        : openAiRefinement
          ? 'Emsal zayıf olsa da AI kondisyon ve araç sinyallerinden kontrollü fiyat düzeltmesi üretti'
          : 'Emsal havuzu zayıf kaldı',
      averageSimilarity ? `ortalama benzerlik ${averageSimilarity}/100` : '',
      parsedSignals.positives[0] || '',
      parsedSignals.negatives[0] || '',
    ].filter(Boolean).join(', ');
  }

  return {
    provider,
    aiEnabled: Boolean(process.env.OPENAI_API_KEY),
    averageSimilarity,
    filteredListings,
    filteredStats,
    reviewRecommendation,
    reviewReason,
    explanation,
    adjustmentPercent,
    parsedSignals,
  };
}
