import { BuildingsProvider } from "../contexts/BuildingsContext";
import BuildingsTable from "../components/BuildingsTable";

const Buildings = () => (
  <BuildingsProvider>
    <BuildingsTable />
  </BuildingsProvider>
);

export default Buildings;
