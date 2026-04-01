export type ProjectCategory = "fullstack" | "frontend" | "game" | "code";

export interface CodeFile {
  name: string;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  company: string;
  description: string;
  tags: string[];
  category: ProjectCategory;
  /** For buildable/static projects: path under /projects/ */
  demoPath?: string;
  /** For code-only projects: files to display */
  codeFiles?: CodeFile[];
}

export const categoryLabels: Record<ProjectCategory, string> = {
  fullstack: "Full-Stack App",
  frontend: "Frontend App",
  game: "Game / Interactive",
  code: "Code Exercise",
};

export const categoryColors: Record<ProjectCategory, string> = {
  fullstack: "#1668dc",
  frontend: "#13c2c2",
  game: "#722ed1",
  code: "#52c41a",
};

export const projects: Project[] = [
  // Full-stack apps
  {
    id: "kraken-app",
    name: "Crypto Trading Pairs Browser",
    company: "Kraken",
    description:
      "Full-stack cryptocurrency trading pair browser using the Kraken API with real-time price updates, pair grouping by base currency, and search functionality.",
    tags: ["React 19", "TypeScript", "Express", "Vite", "Material-UI"],
    category: "fullstack",
    demoPath: "/projects/kraken-app/",
  },
  {
    id: "excitel-countries",
    name: "Countries Explorer",
    company: "Excitel",
    description:
      "React/Node app that displays countries data with search, pagination, sorting, and modal detail views via React Portal.",
    tags: ["React", "Node.js", "Express", "REST API"],
    category: "fullstack",
    demoPath: "/projects/excitel-countries/",
  },
  {
    id: "expensify-app",
    name: "Expense Tracker",
    company: "Expensify",
    description:
      "Full-featured expense tracking app with Firebase authentication, expense management, filtering, date pickers, and a complete dashboard.",
    tags: ["React 15", "Redux", "Firebase", "Webpack"],
    category: "fullstack",
    demoPath: "/projects/expensify-app/",
  },
  // Frontend apps
  {
    id: "proxiad-buildings",
    name: "Buildings Browser",
    company: "Proxiad",
    description:
      "React application for displaying and browsing buildings data with routing and component-based architecture.",
    tags: ["React 17", "React Router", "Context API"],
    category: "frontend",
    demoPath: "/projects/proxiad-buildings/",
  },
  // Games / Interactive
  {
    id: "sett-garden-makeover",
    name: "Garden Makeover",
    company: "Sett",
    description:
      "Interactive 3D web game where players decorate a garden by adding animals, plants, and furniture with animations and particle effects. Bundled as a single HTML file.",
    tags: ["Three.js", "Pixi.js", "GSAP", "Howler.js", "Vite"],
    category: "game",
    demoPath: "/projects/sett-garden-makeover/",
  },
  {
    id: "softgames-ace-of-shadows",
    name: "Ace of Shadows",
    company: "Softgames",
    description:
      "Three interactive 2D demos (Ace of Shadows card game, Magic Words text effects, Phoenix Flame particles) built with Pixi.js featuring scene management and fullscreen support.",
    tags: ["Pixi.js", "TypeScript", "Vite"],
    category: "game",
    demoPath: "/projects/softgames-ace-of-shadows/",
  },
  {
    id: "gong-game",
    name: "Gong Minigame",
    company: "Gong",
    description:
      "Interactive OOP minigame featuring GSAP fade-in animations, pop-in button, and a full-screen Spine skeleton animation player.",
    tags: ["JavaScript", "GSAP", "Spine", "OOP"],
    category: "game",
    demoPath: "/projects/gong-game/",
  },
  {
    id: "barchart-live-coding",
    name: "Bar Chart Renderer",
    company: "Unknown",
    description:
      "Simple bar chart visualization tool that renders data as horizontal bars dynamically sized based on numeric values.",
    tags: ["JavaScript", "HTML", "CSS", "DOM"],
    category: "frontend",
    demoPath: "/projects/barchart-live-coding/",
  },
  {
    id: "kanbanize-app",
    name: "Coding Tasks",
    company: "Kanbanize",
    description:
      "Collection of 4 coding tasks: data grouping, workday calculation, DOM manipulation utilities, and CSV bar chart visualization.",
    tags: ["JavaScript", "TypeScript", "HTML", "CSS"],
    category: "frontend",
    demoPath: "/projects/kanbanize-app/",
    codeFiles: [
      { name: "Task 1 – Group By Number", path: "kanbanize-app/task_1/task_1.js" },
      { name: "Task 2 – Get Workday", path: "kanbanize-app/task_2/task_2.js" },
    ],
  },
  // Code-only projects
  {
    id: "kpmg-live-coding",
    name: "Longest String Finder",
    company: "KPMG",
    description:
      "Utility function that finds and returns the longest string from a mixed-type array, ignoring non-string values. Includes Jest tests.",
    tags: ["JavaScript", "Jest", "Algorithms"],
    category: "code",
    codeFiles: [
      { name: "longestString.js", path: "kpmg-live-coding/longestString.js" },
      { name: "longestString.test.js", path: "kpmg-live-coding/longestString.test.js" },
    ],
  },
  {
    id: "csv-processing-task",
    name: "CSV Processing Examples",
    company: "Unknown",
    description:
      "Multiple CSV parsing implementations: HTML table export, Node.js parsing with regex, and a CSV parsing function example.",
    tags: ["JavaScript", "Node.js", "HTML", "Regex"],
    category: "code",
    codeFiles: [
      { name: "CSV Parse Function", path: "csv-processing-task/.csv parse function.txt" },
      { name: "Export to CSV", path: "csv-processing-task/export to csv.html" },
      { name: "Process CSV (Node.js)", path: "csv-processing-task/process CSV Node.js" },
    ],
  },
  {
    id: "thinkmarkets-live-coding",
    name: "Hobby Page Component",
    company: "ThinkMarkets",
    description:
      "React component skeleton for a live coding interview task about replicating a hobby-related webpage UI.",
    tags: ["React", "JSX", "Live Coding"],
    category: "code",
    codeFiles: [
      { name: "index.jsx", path: "thinkmarkets-live-coding/index.jsx" },
      { name: "Task Description", path: "thinkmarkets-live-coding/livecoding_task.txt" },
    ],
  },
  {
    id: "unknown-live-coding",
    name: "Data Structures & Patterns",
    company: "Unknown",
    description:
      "JavaScript implementations of linked lists (single, double, circular), function currying, and OOP context/this binding examples.",
    tags: ["JavaScript", "Data Structures", "OOP", "Functional"],
    category: "code",
    codeFiles: [
      { name: "Single Linked List", path: "unknown-live-coding/Single_Linked_List.js" },
      { name: "Double Linked List", path: "unknown-live-coding/Double_Linked_List.js" },
      { name: "Circular Linked List", path: "unknown-live-coding/Circular_Linked_List.js" },
      { name: "Currying", path: "unknown-live-coding/currying.js" },
      { name: "OOP Context Change", path: "unknown-live-coding/oop-context-change.js" },
    ],
  },
];
