import { Row, Col, Typography, Segmented } from "antd";
import { useState } from "react";
import { projects, ProjectCategory, categoryLabels } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

const { Title, Paragraph } = Typography;

type Filter = "all" | ProjectCategory;

const filterOptions: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: categoryLabels.fullstack, value: "fullstack" },
  { label: categoryLabels.frontend, value: "frontend" },
  { label: categoryLabels.game, value: "game" },
  { label: categoryLabels.code, value: "code" },
];

function Landing() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title style={{ color: "#e0e0e0", marginBottom: 8 }}>
          Interview Projects
        </Title>
        <Paragraph style={{ color: "#888", fontSize: "1rem", maxWidth: 600, margin: "0 auto" }}>
          A collection of coding projects built for technical interviews.
          Click any project to view a live demo or browse the source code.
        </Paragraph>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <Segmented
          options={filterOptions}
          value={filter}
          onChange={(val) => setFilter(val as Filter)}
          size="large"
        />
      </div>

      <Row gutter={[20, 20]}>
        {filtered.map((project) => (
          <Col key={project.id} xs={24} sm={12} lg={8}>
            <ProjectCard project={project} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Landing;
