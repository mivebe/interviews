# Expense Tracker

A full-featured expense management application with Firebase authentication and real-time data persistence.

## Live Demo

[mivebe-interviews.netlify.app/projects/expensify-app](https://mivebe-interviews.netlify.app/projects/expensify-app/)

## About

Full-stack expense tracking app built as an interview project. Users sign in via Firebase authentication, then create, edit, and delete expenses from a personal dashboard. Expenses can be filtered by date range with a date picker, and a summary view shows total spending. State is managed with Redux Toolkit and persisted to Firebase Firestore.

## Features

- Firebase authentication (login/logout)
- Create, edit, and delete expenses
- Date range filtering with date picker
- Expense summary with totals
- Protected routes (requires authentication)
- Redux state management with Redux Toolkit
- Persistent data via Firebase Firestore
- SCSS styling with normalize.css

## Tech Stack

| Technology | Role |
|---|---|
| [React](https://react.dev/) 18 | UI framework |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [React Redux](https://react-redux.js.org/) 9 | React-Redux bindings |
| [Firebase](https://firebase.google.com/) 12 | Authentication and database |
| [React Router](https://reactrouter.com/) 6 | Client-side routing |
| [React Datepicker](https://reactdatepicker.com/) | Date range selection |
| [Day.js](https://day.js.org/) | Date formatting |
| [Sass](https://sass-lang.com/) | Styling |
| [Express](https://expressjs.com/) | Backend server |
| [Vite](https://vite.dev/) 6 | Build tool and dev server |

## Project Structure

```
expensify-app/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # ExpenseForm, ExpenseList, etc.
│       ├── pages/          # Dashboard, Login, Create, Edit
│       ├── store/          # Redux slices (expenses, filters, auth)
│       ├── App.jsx         # Routes and auth wrapper
│       └── main.jsx        # Entry point
└── server/                 # Express backend
    └── server.js           # Server entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Firebase project with Auth and Firestore enabled

### Install & Run

```bash
# Install client dependencies
npm install --prefix client

# Start development server
npm run dev --prefix client

# Build for production
npm run build --prefix client
```

## Author

[@mivebe](https://github.com/mivebe)
