# Crypto Trading Pairs Browser

A full-stack cryptocurrency trading pair browser powered by the Kraken public API.

## Live Demo

[mivebe-interviews.netlify.app/projects/kraken-app](https://mivebe-interviews.netlify.app/projects/kraken-app/)

## About

Monorepo full-stack application that fetches and displays cryptocurrency trading pairs from the Kraken API. Users can search for specific pairs, browse pairs grouped by quote currency, and view real-time price data that auto-refreshes every 5 seconds. Built as an interview project demonstrating modern React with a TypeScript backend.

## Features

- Browse all available cryptocurrency trading pairs
- Search functionality for finding specific pairs
- Pairs grouped by quote currency (USD, EUR, etc.) with counts
- Real-time price updates with 5-second polling interval
- URL-based navigation (e.g., `/BTCUSD` loads that pair directly)
- Detailed price data including high/low values

## Tech Stack

| Technology | Role |
|---|---|
| [React](https://react.dev/) 19 | UI framework (client) |
| [TypeScript](https://www.typescriptlang.org/) 6 | Type safety (client + server) |
| [Material-UI](https://mui.com/) 7 | UI component library |
| [React Router](https://reactrouter.com/) 7 | Client-side routing |
| [Express](https://expressjs.com/) 5 | API server |
| [Vitest](https://vitest.dev/) | Testing (client + server) |
| [Vite](https://vite.dev/) 8 | Build tool and dev server |

## Project Structure

```
kraken-app/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # PairSearch, CurrencyDisplay, GroupedPairs
│       ├── App.tsx         # Main app with routing
│       └── main.tsx        # Entry point
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # Kraken API proxy routes
│       └── index.ts        # Server entry point (port 3001)
└── package.json            # Root scripts with concurrently
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies for both client and server
npm install --prefix client && npm install --prefix server

# Start both client and server concurrently
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Author

[@mivebe](https://github.com/mivebe)
