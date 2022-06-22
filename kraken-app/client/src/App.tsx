import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import { Typography } from "@mui/material";
import Currency from "./components/Currency";
import PairSearch from "./components/PairSearch";
import PairGroups from "./components/PairGroups";
import { fetchAssetPairs, buildPairGroups, fetchData } from "./api/kraken";
import type { TradingPair, PairData } from "./types";

function App() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [currentAltname, setCurrentAltname] = useState("");
  const [desiredPair, setDesiredPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const groups = useMemo(() => buildPairGroups(pairs), [pairs]);

  useEffect(() => {
    fetchAssetPairs().then(setPairs).catch(console.error);
  }, []);

  const getData = useCallback(async (altname: string) => {
    try {
      setError(null);
      const res = await fetchData(altname);
      const pairName = Object.keys(res)[0];
      if (pairName) {
        setDesiredPair({ ...res[pairName], pairName });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch pair data";
      setError(message);
      setDesiredPair(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      const pairFromUrl = location.pathname.slice(1);
      setCurrentAltname(pairFromUrl);
      getData(pairFromUrl);
    }
  }, [location, getData]);

  useEffect(() => {
    if (!currentAltname) return;
    const interval = setInterval(() => getData(currentAltname), 5000);
    return () => clearInterval(interval);
  }, [currentAltname, getData]);

  const handlePairSelect = useCallback(
    (pair: TradingPair) => {
      setLoading(true);
      setCurrentAltname(pair.altname);
      getData(pair.altname);
    },
    [getData]
  );

  return (
    <div id="app-container">
      <AppBar
        position="static"
        sx={{
          minHeight: "50px",
          padding: "10px 20px",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <img
          src="/kraken_logo_text.jpg"
          alt="Kraken"
          style={{ height: 40, borderRadius: 8 }}
        />
        <Typography variant="h6" component="span">
          Kraken App
        </Typography>
      </AppBar>
      <div id="Home">
        <PairSearch pairs={pairs} onSelect={handlePairSelect} />
        {loading && <CircularProgress sx={{ margin: "20px" }} />}
        <div id="results-container">
          {error && (
            <Typography color="error" sx={{ margin: "20px" }}>
              {error}
            </Typography>
          )}
          {desiredPair && <Currency pairData={desiredPair} />}
        </div>
        <PairGroups
          groups={groups}
          onSelect={handlePairSelect}
          activePairAltname={currentAltname}
        />
      </div>
    </div>
  );
}

export default App;
