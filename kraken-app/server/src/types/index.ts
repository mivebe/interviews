export interface KrakenApiResponse<T = unknown> {
  error: string[];
  result: T;
}

export interface TickerData {
  [pairName: string]: {
    h: [string, string];
    [key: string]: unknown;
  };
}

export interface AssetsData {
  [assetName: string]: {
    aclass: string;
    altname: string;
    decimals: number;
    display_decimals: number;
    [key: string]: unknown;
  };
}

export interface AssetPairsData {
  [pairName: string]: {
    base: string;
    quote: string;
    [key: string]: unknown;
  };
}
