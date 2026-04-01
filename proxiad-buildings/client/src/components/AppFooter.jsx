import { Layout, Space } from "antd";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const { Footer } = Layout;

const AppFooter = () => {
  const { isDark } = useTheme();

  return (
    <Footer
      style={{
        background: isDark ? "#1a1a2e" : "#fff",
        borderTop: `1px solid ${isDark ? "#2a2a4a" : "#e8e8e8"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        transition: "all 0.3s",
      }}
    >
      <Space size="large">
        <Link to="/" style={{ color: "#1668dc" }}>
          Home
        </Link>
        <Link to="/buildings" style={{ color: "#1668dc" }}>
          Buildings
        </Link>
      </Space>
      <span style={{ color: isDark ? "#666" : "#999" }}>Building App</span>
    </Footer>
  );
};

export default AppFooter;
