import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchData,
  fetchAssetPairs,
  buildPairGroups,
  getHighValue,
} from "../src/api/kraken";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("getHighValue", () => {
  it("returns the higher of two string values", () => {
    expect(getHighValue(["100.50", "200.75"])).toBe(200.75);
  });

  it("handles equal values", () => {
    expect(getHighValue(["50", "50"])).toBe(50);
  });
});

describe("fetchData", () => {
  it("fetches ticker data for a pair", async () => {
    const mockResponse = { XXBTZUSD: { h: ["50000", "51000"] } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchData("XBTUSD");
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("/api/currencypair?pair=XBTUSD");
  });

  it("throws on server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Kraken API error: 503" }),
      })
    );

    await expect(fetchData("INVALID")).rejects.toThrow("Kraken API error: 503");
  });
});

describe("fetchAssetPairs", () => {
  it("returns trading pairs with label, altname, base, quote", async () => {
    const mockResponse = {
      XXBTZUSD: {
        base: "XXBT",
        quote: "ZUSD",
        altname: "XBTUSD",
        wsname: "XBT/USD",
      },
      DOTUSD: {
        base: "DOT",
        quote: "ZUSD",
        altname: "DOTUSD",
        wsname: "DOT/USD",
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchAssetPairs();
    expect(result).toEqual([
      { key: "XXBTZUSD", label: "XBT/USD", altname: "XBTUSD", base: "XBT", quote: "USD" },
      { key: "DOTUSD", label: "DOT/USD", altname: "DOTUSD", base: "DOT", quote: "USD" },
    ]);
    expect(fetch).toHaveBeenCalledWith("/api/assetpairs");
  });

  it("skips pairs without wsname", async () => {
    const mockResponse = {
      XXBTZUSD: { base: "XXBT", quote: "ZUSD", altname: "XBTUSD", wsname: "XBT/USD" },
      DARKPAIR: { base: "DARK", quote: "ZUSD", altname: "DARKUSD" },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchAssetPairs();
    expect(result).toHaveLength(1);
    expect(result[0].altname).toBe("XBTUSD");
  });

  it("throws on server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      })
    );

    await expect(fetchAssetPairs()).rejects.toThrow("Server error");
  });
});

describe("buildPairGroups", () => {
  it("groups pairs by quote currency sorted by count descending", () => {
    const pairs = [
      { key: "XXBTZUSD", label: "XBT/USD", altname: "XBTUSD", base: "XBT", quote: "USD" },
      { key: "DOTUSD", label: "DOT/USD", altname: "DOTUSD", base: "DOT", quote: "USD" },
      { key: "XETHZEUR", label: "ETH/EUR", altname: "ETHEUR", base: "ETH", quote: "EUR" },
    ];
    const groups = buildPairGroups(pairs);
    expect(groups).toHaveLength(2);
    expect(groups[0].quote).toBe("USD");
    expect(groups[0].pairs).toHaveLength(2);
    expect(groups[1].quote).toBe("EUR");
    expect(groups[1].pairs).toHaveLength(1);
  });

  it("sorts pairs within a group alphabetically by base", () => {
    const pairs = [
      { key: "XXBTZUSD", label: "XBT/USD", altname: "XBTUSD", base: "XBT", quote: "USD" },
      { key: "DOTUSD", label: "DOT/USD", altname: "DOTUSD", base: "DOT", quote: "USD" },
      { key: "ADAUSD", label: "ADA/USD", altname: "ADAUSD", base: "ADA", quote: "USD" },
    ];
    const groups = buildPairGroups(pairs);
    expect(groups[0].pairs.map((p) => p.base)).toEqual(["ADA", "DOT", "XBT"]);
  });

  it("returns empty array for empty input", () => {
    expect(buildPairGroups([])).toEqual([]);
  });
});
