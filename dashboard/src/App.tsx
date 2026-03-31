import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Landing from "./pages/Landing";
import CodeViewer from "./pages/CodeViewer";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Header
        style={{
          background: "#1a1a2e",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid #2a2a4a",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              color: "#e0e0e0",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Interview Projects
          </h1>
        </a>
      </Header>
      <Content style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/code/:projectId" element={<CodeViewer />} />
        </Routes>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#0a0a1a",
          color: "#666",
          borderTop: "1px solid #1a1a2e",
        }}
      >
        Interview Portfolio &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
