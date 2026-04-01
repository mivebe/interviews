import { Layout, Avatar, Typography, Switch, Space } from "antd";
import { UserOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";

const base = import.meta.env.BASE_URL;

const { Header } = Layout;

const AppHeader = () => {
  const { isDark, toggle } = useTheme();

  return (
    <Header
      style={{
        background: isDark ? "#1a1a2e" : "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: `1px solid ${isDark ? "#2a2a4a" : "#e8e8e8"}`,
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s",
      }}
    >
      <Typography.Title
        level={4}
        style={{ color: isDark ? "#e0e0e0" : "#333", margin: 0 }}
      >
        Welcome
      </Typography.Title>
      <Space size="middle">
        <Switch
          checked={isDark}
          onChange={toggle}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
        />
        <Avatar
          size="large"
          icon={<UserOutlined />}
          src={`${base}images/avatar.png`}
          style={isDark ? { filter: "brightness(0) invert(1)" } : undefined}
        />
      </Space>
    </Header>
  );
};

export default AppHeader;
