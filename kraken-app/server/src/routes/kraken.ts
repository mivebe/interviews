import { Router, Request, Response } from "express";
import type { KrakenApiResponse } from "../types/index.js";

const KRAKEN_BASE_URL = "https://api.kraken.com/0/public";

const router = Router();

async function queryKraken<T>(
  endpoint: string,
  params?: string
): Promise<T> {
  const url = params
    ? `${KRAKEN_BASE_URL}/${endpoint}?${params}`
    : `${KRAKEN_BASE_URL}/${endpoint}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Kraken API error: ${response.status}`);
  }

  const data = (await response.json()) as KrakenApiResponse<T>;

  if (data.error && data.error.length > 0) {
    throw new Error(`Kraken API error: ${data.error.join(", ")}`);
  }

  return data.result;
}

router.get("/currencypair", async (req: Request, res: Response) => {
  try {
    const pair = req.query.pair as string | undefined;
    const result = await queryKraken("Ticker", pair ? `pair=${pair}` : undefined);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/assets", async (_req: Request, res: Response) => {
  try {
    const result = await queryKraken("Assets");
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/assetpairs", async (_req: Request, res: Response) => {
  try {
    const result = await queryKraken("AssetPairs");
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.get("/status", async (_req: Request, res: Response) => {
  try {
    const result = await queryKraken("SystemStatus");
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
