import type {
  AssetPairsResponse,
  PairGroup,
  TickerResponse,
  TradingPair,
} from "../types";

export async function fetchData(desiredPair: string): Promise<TickerResponse> {
  const response = await fetch(`/.netlify/functions/kraken-api/currencypair?pair=${desiredPair}`);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error ?? `Server error: ${response.status}`);
  }
  return response.json();
}

export async function fetchAssetPairs(): Promise<TradingPair[]> {
  const response = await fetch("/.netlify/functions/kraken-api/assetpairs");
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error ?? `Server error: ${response.status}`);
  }
  const data: AssetPairsResponse = await response.json();
  return Object.entries(data)
    .filter(([, info]) => info.wsname)
    .map(([key, info]) => {
      const [base, quote] = info.wsname.split("/");
      return { key, label: info.wsname, altname: info.altname, base, quote };
    });
}

export function buildPairGroups(pairs: TradingPair[]): PairGroup[] {
  const groupMap = new Map<string, TradingPair[]>();
  for (const pair of pairs) {
    const existing = groupMap.get(pair.quote) ?? [];
    existing.push(pair);
    groupMap.set(pair.quote, existing);
  }
  return Array.from(groupMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([quote, groupPairs]) => ({
      quote,
      pairs: groupPairs.sort((a, b) => a.base.localeCompare(b.base)),
    }));
}

export function getHighValue(highArr: [string, string]): number {
  return Math.max(...highArr.map(Number));
}
