import { Link } from "react-router-dom";
import { Typography, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";

const { Title, Paragraph } = Typography;

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ textAlign: "center", maxWidth: 600, padding: "0 24px" }}>
      <HomeOutlined style={{ fontSize: 48, color: "#1668dc", marginBottom: 24 }} />
      <Title style={{ color: isDark ? "#e0e0e0" : "#333" }}>Buildings</Title>
      <Paragraph style={{ color: isDark ? "#888" : "#666", fontSize: "1rem", marginBottom: 32 }}>
        A prototype CRUD application for managing building records. Browse,
        add, edit, and delete buildings with image previews.
      </Paragraph>
      <Link to="/buildings">
        <Button type="primary" size="large">
          View Buildings
        </Button>
      </Link>
    </div>
  );
};

export default Home;
