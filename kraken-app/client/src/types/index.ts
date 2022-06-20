export interface PairData {
  pairName: string;
  h: [string, string];
  [key: string]: unknown;
}

export type TickerResponse = Record<
  string,
  {
    h: [string, string];
    [key: string]: unknown;
  }
>;

export interface TradingPair {
  key: string;
  label: string;
  altname: string;
  base: string;
  quote: string;
}

export interface PairGroup {
  quote: string;
  pairs: TradingPair[];
}

export interface AssetPairInfo {
  base: string;
  quote: string;
  altname: string;
  wsname: string;
  [key: string]: unknown;
}

export type AssetPairsResponse = Record<string, AssetPairInfo>;