# Interview Portfolio Dashboard

The shell application that powers the interview portfolio -- a unified hub for browsing all projects.

## Live Demo

[mivebe-interviews.netlify.app](https://mivebe-interviews.netlify.app/)

## About

A React + TypeScript single-page application that serves as the central portfolio dashboard. It renders project cards on a landing page organized by category and provides a built-in code viewer for source-only projects using Shiki syntax highlighting.

All sub-projects build into this shell's `dist/` directory, enabling a single Netlify deployment for the entire portfolio.

## Features

- Project cards grouped by category (Full-Stack, Frontend, Game, Code Exercise)
- Built-in code viewer with syntax highlighting via Shiki
- Dark theme design
- Responsive layout
- Client-side routing with React Router

## Tech Stack

| Technology | Role |
|---|---|
| [React](https://react.dev/) 18 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) 5.6 | Type safety |
| [Ant Design](https://ant.design/) 5 | UI component library |
| [React Router](https://reactrouter.com/) 6 | Client-side routing |
| [Shiki](https://shiki.style/) | Code syntax highlighting |
| [Vite](https://vite.dev/) 6 | Build tool and dev server |

## Project Structure

```
src/
├── pages/
│   ├── Landing.tsx         # Project directory with category cards
│   └── CodeViewer.tsx      # Source code viewer with Shiki
├── components/
│   └── ProjectCard.tsx     # Individual project card component
├── data/
│   └── projects.ts         # Project metadata (names, tags, paths)
├── styles/
├── App.tsx                 # Root layout with header, content, footer
└── main.tsx                # Entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (dashboard only)
npm run dev

# Build the full portfolio (all sub-projects)
bash build-all.sh

# Preview the production build
npm run preview
```

## Author

[@mivebe](https://github.com/mivebe)
