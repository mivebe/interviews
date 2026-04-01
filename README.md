# Interview Portfolio

A collection of interview coding projects spanning full-stack applications, frontend apps, interactive games, and algorithm exercises -- deployed as a unified dashboard.

## Live Demo

[mivebe-interviews.netlify.app](https://mivebe-interviews.netlify.app/)

## Projects

### Full-Stack Apps

| Project | Company | Description | Tech |
|---|---|---|---|
| [Crypto Trading Pairs Browser](kraken-app/) | Kraken | Real-time cryptocurrency pair browser with search, grouping, and 5-second price polling | React 19, TypeScript, Express, MUI, Vite |
| [Countries Explorer](excitel-countries/) | Excitel | Searchable countries table with pagination, sorting, and detail modals via React Portal | React, Node.js, Express |
| [Expense Tracker](expensify-app/) | Expensify | Expense management with Firebase auth, Redux state, date filtering, and a dashboard | React, Redux Toolkit, Firebase, Vite |

### Frontend Apps

| Project | Company | Description | Tech |
|---|---|---|---|
| [Buildings Browser](proxiad-buildings/) | Proxiad | Building data browser with theme switching and Ant Design components | React, React Router, Ant Design |
| [Bar Chart Renderer](barchart-live-coding/) | -- | Horizontal bar chart visualization from numeric data | Vanilla JavaScript |
| [Coding Tasks](kanbanize-app/) | Kanbanize | Four tasks: data grouping, workday calculation, DOM manipulation, CSV charting | JavaScript, TypeScript |

### Games / Interactive

| Project | Company | Description | Tech |
|---|---|---|---|
| [Garden Makeover](sett-garden-makeover/) | Sett | Interactive 3D garden decoration game bundled as a single HTML file | Three.js, Pixi.js, GSAP, Howler.js |
| [Ace of Shadows](softgames-ace-of-shadows/) | Softgames | Three 2D demos: card dealing, text effects, particle fire | Pixi.js, TypeScript |
| [Gong Minigame](gong-game/) | Gong | OOP animation demo with GSAP and Spine skeleton player | JavaScript, GSAP, Spine |

### Code Exercises

| Project | Company | Description | Tech |
|---|---|---|---|
| [Longest String Finder](kpmg-live-coding/) | KPMG | Find the longest string in a mixed-type array (with Jest tests) | JavaScript, Jest |
| [CSV Processing](csv-processing-task/) | -- | Multiple CSV parsing and export implementations | JavaScript, Node.js |
| [Data Structures](unknown-live-coding/) | -- | Linked lists (single, double, circular), currying, OOP context binding | JavaScript |
| [Hobby Page Component](thinkmarkets-live-coding/) | ThinkMarkets | React component skeleton for a hobby page UI | React, JSX |

## Architecture

The [dashboard](dashboard/) is a React 18 + TypeScript shell application that serves as the portfolio hub. All sub-projects are built and copied into the dashboard's `dist/` directory via `build-all.sh`, enabling a single Netlify deployment.

- **Buildable projects** (Vite/Webpack) are compiled and served as nested SPAs under `/projects/`
- **Static projects** (vanilla HTML/JS) are copied directly
- **Code-only exercises** are displayed through the dashboard's built-in code viewer with Shiki syntax highlighting
- **Serverless functions** in `netlify/functions/` proxy external API calls (Kraken, Excitel)

## Author

[@mivebe](https://github.com/mivebe)
