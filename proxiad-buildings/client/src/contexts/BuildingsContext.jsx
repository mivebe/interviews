import { useState, createContext, useCallback } from "react";
import buildingsResponse from "../data/buildingsData.json";

export const BuildingsContext = createContext({});

export const BuildingsProvider = ({ children }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBuildings(buildingsResponse);
    setLoading(false);
  }, []);

  const addBuilding = useCallback((data) => {
    setBuildings((prev) => [...prev, { ...data, id: Date.now() }]);
  }, []);

  const editBuilding = useCallback((data) => {
    setBuildings((prev) =>
      prev.map((el) => (el.id === data.id ? { ...el, ...data } : el))
    );
  }, []);

  const deleteBuilding = useCallback((id) => {
    setBuildings((prev) => prev.filter((el) => el.id !== id));
  }, []);

  return (
    <BuildingsContext.Provider
      value={{
        buildings,
        loading,
        fetchBuildings,
        addBuilding,
        editBuilding,
        deleteBuilding,
      }}
    >
      {children}
    </BuildingsContext.Provider>
  );
};
