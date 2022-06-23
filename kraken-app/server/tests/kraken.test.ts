import { describe, it, expect, vi, beforeEach } from "vitest";

const mockTickerResponse = {
  error: [],
  result: {
    XXBTZUSD: {
      h: ["50000.00", "51000.00"],
      a: ["50000.00", "1", "1.000"],
    },
  },
};

const mockAssetsResponse = {
  error: [],
  result: {
    XXBT: { aclass: "currency", altname: "XBT", decimals: 10, display_decimals: 5 },
    ZUSD: { aclass: "currency", altname: "USD", decimals: 4, display_decimals: 2 },
  },
};

const mockAssetPairsResponse = {
  error: [],
  result: {
    XXBTZUSD: { base: "XXBT", quote: "ZUSD", altname: "XBTUSD" },
    DOTUSD: { base: "DOT", quote: "ZUSD", altname: "DOTUSD" },
  },
};

const mockStatusResponse = {
  error: [],
  result: { status: "online", timestamp: "2024-01-01T00:00:00Z" },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Kraken API routes", () => {
  it("GET /currencypair returns ticker data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTickerResponse),
      })
    );

    const { default: app } = await import("../src/index.js");
    const response = await makeRequest(app, "/currencypair?pair=XXBTZUSD");

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("XXBTZUSD");
    expect(body.XXBTZUSD.h).toEqual(["50000.00", "51000.00"]);
  });

  it("GET /assets returns asset list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAssetsResponse),
      })
    );

    const { default: app } = await import("../src/index.js");
    const response = await makeRequest(app, "/assets");

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("XXBT");
    expect(body).toHaveProperty("ZUSD");
  });

  it("GET /assetpairs returns asset pairs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAssetPairsResponse),
      })
    );

    const { default: app } = await import("../src/index.js");
    const response = await makeRequest(app, "/assetpairs");

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("XXBTZUSD");
    expect(body.XXBTZUSD.base).toBe("XXBT");
    expect(body).toHaveProperty("DOTUSD");
    expect(body.DOTUSD.base).toBe("DOT");
  });

  it("GET /status returns system status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatusResponse),
      })
    );

    const { default: app } = await import("../src/index.js");
    const response = await makeRequest(app, "/status");

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("status", "online");
  });

  it("returns 500 on Kraken API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      })
    );

    const { default: app } = await import("../src/index.js");
    const response = await makeRequest(app, "/currencypair?pair=INVALID");

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });
});

async function makeRequest(
  app: { listen: Function },
  path: string
): Promise<Response> {
  return new Promise((resolve) => {
    const server = (app as any).listen(0, async () => {
      const address = server.address();
      const port = typeof address === "object" ? address?.port : address;
      try {
        const realFetch = globalThis.fetch;
        // We need to use the real fetch for the test request to our server
        // but the mocked fetch for the server's outbound Kraken requests
        // Since we already stubbed fetch, we need to use http directly
        const http = await import("node:http");
        const result = await new Promise<Response>((res) => {
          http.get(`http://localhost:${port}${path}`, (resp) => {
            let data = "";
            resp.on("data", (chunk: string) => (data += chunk));
            resp.on("end", () => {
              res(
                new Response(data, {
                  status: resp.statusCode ?? 500,
                  headers: { "content-type": "application/json" },
                })
              );
            });
          });
        });
        resolve(result);
      } finally {
        server.close();
      }
    });
  });
}
