import { Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import { useTheme } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Buildings from "./pages/Buildings";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

const { Content } = Layout;

const darkTokens = {
  colorPrimary: "#1668dc",
  borderRadius: 8,
  colorBgContainer: "#1a1a2e",
  colorBgElevated: "#16213e",
};

const lightTokens = {
  colorPrimary: "#1668dc",
  borderRadius: 8,
};

function App() {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDark ? darkTokens : lightTokens,
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          background: isDark ? "#0a0a1a" : "#f5f5f5",
          transition: "background 0.3s",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Content style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Home />
                </Content>
                <AppFooter />
              </>
            }
          />
          <Route
            path="/buildings"
            element={
              <>
                <AppHeader />
                <Content style={{ flex: 1, padding: "24px" }}>
                  <Buildings />
                </Content>
                <AppFooter />
              </>
            }
          />
        </Routes>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
