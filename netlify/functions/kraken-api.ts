import type { Context } from "@netlify/functions";

const KRAKEN_BASE_URL = "https://api.kraken.com/0/public";

interface KrakenApiResponse<T> {
  error: string[];
  result: T;
}

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

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  // Path will be like /.netlify/functions/kraken-api/currencypair
  const pathParts = url.pathname.split("/");
  const route = pathParts[pathParts.length - 1];

  try {
    let result: unknown;

    switch (route) {
      case "currencypair": {
        const pair = url.searchParams.get("pair");
        result = await queryKraken("Ticker", pair ? `pair=${pair}` : undefined);
        break;
      }
      case "assets":
        result = await queryKraken("Assets");
        break;
      case "assetpairs":
        result = await queryKraken("AssetPairs");
        break;
      case "status":
        result = await queryKraken("SystemStatus");
        break;
      default:
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: CORS_HEADERS,
        });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const config = {
  path: "/.netlify/functions/kraken-api/*",
};
