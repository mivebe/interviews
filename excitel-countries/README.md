# Countries Explorer

A React/Node full-stack SPA for browsing world countries data with search, pagination, and sorting.

## Live Demo

[mivebe-interviews.netlify.app/projects/excitel-countries](https://mivebe-interviews.netlify.app/projects/excitel-countries/)

## About

Built as an interview project for Excitel, this application displays country data from a public REST API. It features debounced search with typeahead suggestions, a paginated and sortable data table, and a detail modal rendered via React Portal. The app uses only public endpoints -- no registration or API keys required.

## Features

- Search countries by name with debounced suggestions
- Pagination with configurable items per page
- Sortable columns with alphabetical, reversed, and mutative sorting
- Detail modal via React Portal (triggered by long-press on any row)
- URL-based search navigation (e.g., `/Portugal`)
- Responsive table that hides columns on smaller screens

## Tech Stack

| Technology | Role |
|---|---|
| [React](https://react.dev/) 18 | UI framework |
| [React Router](https://reactrouter.com/) 6 | Client-side routing |
| [Node.js](https://nodejs.org/) | Server runtime |
| [Express](https://expressjs.com/) 4 | API proxy server |
| [Vite](https://vite.dev/) 6 | Build tool and dev server |

## Project Structure

```
excitel-countries/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Table, Search, Modal, Pagination
│       ├── App.jsx         # Main app with routing
│       └── main.jsx        # Entry point
└── server/                 # Express backend
    └── index.js            # API proxy to Excitel REST endpoints
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies
npm install

# Start both client and server
npm run dev

# Or start individually
npm start        # Frontend only
npm run server   # Backend only
```

## Author

[@mivebe](https://github.com/mivebe)
