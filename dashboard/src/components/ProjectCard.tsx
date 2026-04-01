import { Card, Tag, Typography } from "antd";
import {
  CodeOutlined,
  GlobalOutlined,
  RocketOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Project, categoryLabels, categoryColors } from "../data/projects";

const { Text, Paragraph } = Typography;

const categoryIcons: Record<string, React.ReactNode> = {
  fullstack: <GlobalOutlined />,
  frontend: <RocketOutlined />,
  game: <ExperimentOutlined />,
  code: <CodeOutlined />,
};

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const isDemo = !!project.demoPath;
  const hasCode = !!project.codeFiles;
  const href = isDemo ? project.demoPath! : `/code/${project.id}`;

  return (
    <a href={href} style={{ textDecoration: "none" }} target={isDemo ? "_blank" : undefined} rel={isDemo ? "noopener noreferrer" : undefined}>
      <Card
        hoverable
        style={{
          background: "#1a1a2e",
          borderColor: "#2a2a4a",
          height: "100%",
        }}
        styles={{
          body: { padding: "20px" },
        }}
      >
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tag
            color={categoryColors[project.category]}
            icon={categoryIcons[project.category]}
            style={{ margin: 0 }}
          >
            {categoryLabels[project.category]}
          </Tag>
          {project.company !== "Unknown" && (
            <Text style={{ color: "#888", fontSize: "0.8rem" }}>
              {project.company}
            </Text>
          )}
        </div>
        <Typography.Title
          level={4}
          style={{ color: "#e0e0e0", margin: "8px 0", fontSize: "1.1rem" }}
        >
          {project.name}
        </Typography.Title>
        <Paragraph
          style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: 16 }}
          ellipsis={{ rows: 3 }}
        >
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
                fontSize: "0.75rem",
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        {isDemo && hasCode && (
          <a
            href={`/code/${project.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              color: "#52c41a",
              fontSize: "0.8rem",
            }}
          >
            <CodeOutlined /> View Code
          </a>
        )}
      </Card>
    </a>
  );
}

export default ProjectCard;
