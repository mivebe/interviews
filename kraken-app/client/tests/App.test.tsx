import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

const mockAssetPairsResponse = {
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
  XETHZEUR: {
    base: "XETH",
    quote: "ZEUR",
    altname: "ETHEUR",
    wsname: "ETH/EUR",
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAssetPairsResponse),
    })
  );
});

describe("App", () => {
  it("renders the app header with logo and title", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByAltText("Kraken")).toBeInTheDocument();
    expect(screen.getByText("Kraken App")).toBeInTheDocument();
  });

  it("renders the search pair autocomplete", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Search pair")).toBeInTheDocument();
  });

  it("renders quote-currency accordion groups after loading", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText(/USD \(2 pairs\)/)).toBeInTheDocument();
    expect(await screen.findByText(/EUR \(1 pairs\)/)).toBeInTheDocument();
  });

  it("fetches assetpairs on mount", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(fetch).toHaveBeenCalledWith("/api/assetpairs");
  });
});
