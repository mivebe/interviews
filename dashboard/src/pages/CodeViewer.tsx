import { useParams, Link } from "react-router-dom";
import { Typography, Tabs, Spin, Tag, Button } from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { projects, categoryLabels, categoryColors } from "../data/projects";

const { Title, Paragraph } = Typography;

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    html: "html",
    css: "css",
    json: "json",
    txt: "text",
  };
  return map[ext] ?? "text";
}

function CodeViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projects.find((p) => p.id === projectId);
  const [highlighted, setHighlighted] = useState<Record<string, string>>({});
  const [rawCode, setRawCode] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const highlighterRef = useRef<Awaited<ReturnType<typeof import("shiki/bundle/web")["createHighlighter"]>> | null>(null);

  useEffect(() => {
    if (!project?.codeFiles) return;

    const loadFiles = async () => {
      setLoading(true);

      // Lazy-load shiki with only web languages
      const { createHighlighter } = await import("shiki/bundle/web");
      if (!highlighterRef.current) {
        highlighterRef.current = await createHighlighter({
          themes: ["github-dark-default"],
          langs: ["javascript", "typescript", "jsx", "tsx", "html", "css", "json"],
        });
      }
      const highlighter = highlighterRef.current;

      const htmls: Record<string, string> = {};
      const raws: Record<string, string> = {};

      for (const file of project.codeFiles!) {
        try {
          const res = await fetch(`/code-files/${file.path}`);
          const text = await res.text();
          raws[file.path] = text;

          const lang = getLanguage(file.path);
          if (lang === "text") {
            htmls[file.path] = `<pre style="background:#0d1117;color:#e6edf3;padding:20px;border-radius:8px;overflow-x:auto"><code>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
          } else {
            htmls[file.path] = highlighter.codeToHtml(text, {
              lang,
              theme: "github-dark-default",
            });
          }
        } catch {
          htmls[file.path] = "<pre>Failed to load file</pre>";
        }
      }

      setRawCode(raws);
      setHighlighted(htmls);
      setLoading(false);
    };

    loadFiles();
  }, [project]);

  const isRunnable = useCallback(
    (filePath: string) => {
      const lang = getLanguage(filePath);
      return lang === "javascript" || lang === "typescript";
    },
    []
  );

  const runCode = useCallback(
    (filePath: string) => {
      const code = rawCode[filePath];
      if (!code) return;

      const logs: string[] = [];
      const fakeConsole = {
        log: (...args: unknown[]) =>
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
        error: (...args: unknown[]) =>
          logs.push("ERROR: " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
        warn: (...args: unknown[]) =>
          logs.push("WARN: " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
      };

      try {
        const fn = new Function("console", code);
        fn(fakeConsole);
      } catch (err) {
        logs.push("ERROR: " + (err instanceof Error ? err.message : String(err)));
      }

      setOutput((prev) => ({ ...prev, [filePath]: logs }));
    },
    [rawCode]
  );

  if (!project) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Title level={3} style={{ color: "#e0e0e0" }}>
          Project not found
        </Title>
        <Link to="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const tabItems = project.codeFiles?.map((file) => ({
    key: file.path,
    label: file.name,
    children: loading ? (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    ) : (
      <div>
        {isRunnable(file.path) && (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => runCode(file.path)}
            style={{ marginBottom: 12 }}
          >
            Run
          </Button>
        )}
        <div
          className="code-block"
          dangerouslySetInnerHTML={{ __html: highlighted[file.path] ?? "" }}
        />
        {output[file.path] && (
          <div
            style={{
              marginTop: 16,
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: 8,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 13,
              whiteSpace: "pre-wrap",
              color: "#58a6ff",
            }}
          >
            <div style={{ color: "#8b949e", marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Console Output
            </div>
            {output[file.path].map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith("ERROR:") ? "#f85149" : line.startsWith("WARN:") ? "#d29922" : "#e6edf3",
                  padding: "2px 0",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <Link to="/">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          style={{ color: "#888", marginBottom: 16 }}
        >
          Back to Projects
        </Button>
      </Link>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Title level={2} style={{ color: "#e0e0e0", margin: 0 }}>
            {project.name}
          </Title>
          <Tag color={categoryColors[project.category]}>
            {categoryLabels[project.category]}
          </Tag>
        </div>
        {project.company !== "Unknown" && (
          <Paragraph style={{ color: "#888", margin: "4px 0" }}>
            {project.company}
          </Paragraph>
        )}
        <Paragraph style={{ color: "#aaa", maxWidth: 700 }}>
          {project.description}
        </Paragraph>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                background: "#16213e",
                borderColor: "#2a2a4a",
                color: "#b0b0b0",
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <Tabs items={tabItems} type="card" />
    </div>
  );
}

export default CodeViewer;
