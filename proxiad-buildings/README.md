# Buildings Browser

A React SPA for browsing and viewing building information with theme switching.

## Live Demo

[mivebe-interviews.netlify.app/projects/proxiad-buildings](https://mivebe-interviews.netlify.app/projects/proxiad-buildings/)

## About

Built as an interview task for Proxiad, this application displays building data in a browsable table with detail modals. It uses React Router for client-side navigation, React Context for theme management (light/dark mode), and Ant Design for the component library.

## Features

- Buildings table with browsable entries
- Detail modal for viewing building information
- Light/dark theme toggle via React Context
- Client-side routing with home and buildings pages
- Responsive layout with Ant Design components

## Tech Stack

| Technology | Role |
|---|---|
| [React](https://react.dev/) 18 | UI framework |
| [React Router](https://reactrouter.com/) 6 | Client-side routing |
| [Ant Design](https://ant.design/) 5 | UI component library |
| [Vite](https://vite.dev/) 6 | Build tool and dev server |

## Project Structure

```
proxiad-buildings/
└── client/
    └── src/
        ├── pages/          # Home, Buildings
        ├── components/     # Header, Footer, BuildingModal
        ├── contexts/       # Theme context (light/dark)
        ├── data/           # Building data
        ├── styles/         # CSS styles
        ├── App.jsx         # Root layout with routing
        └── main.jsx        # Entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies
cd client && npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Author

[@mivebe](https://github.com/mivebe)
