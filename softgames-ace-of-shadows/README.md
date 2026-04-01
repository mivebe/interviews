# Ace of Shadows

Three interactive 2D demos built with Pixi.js and TypeScript.

## Live Demo

[mivebe-interviews.netlify.app/projects/softgames-ace-of-shadows](https://mivebe-interviews.netlify.app/projects/softgames-ace-of-shadows/)

## About

A game developer assignment for Softgames featuring three distinct interactive scenes, each demonstrating different Pixi.js capabilities. The project uses a scene management architecture with an abstract base class, allowing smooth transitions between demos. Includes fullscreen support and an FPS counter for performance monitoring.

## Features

- **Ace of Shadows** -- Card stack with animated dealing mechanics
- **Magic Words** -- Text dialogue rendering with random styling effects
- **Phoenix Flame** -- Particle emitter fire effect system
- Scene manager with menu navigation
- Fullscreen mode toggle
- Real-time FPS counter

## Tech Stack

| Technology | Role |
|---|---|
| [Pixi.js](https://pixijs.com/) 8 | 2D WebGL rendering engine |
| [TypeScript](https://www.typescriptlang.org/) 5.7 | Type safety |
| [Vite](https://vite.dev/) 6 | Build tool and dev server |

## Project Structure

```
src/
├── core/
│   ├── SceneManager.ts     # Scene lifecycle and transitions
│   ├── MenuScene.ts        # Main menu with scene selection
│   └── FpsCounter.ts       # Performance monitoring overlay
├── ace-of-shadows/         # Scene 1: Card dealing demo
├── magic-words/            # Scene 2: Text effects demo
├── phoenix-flame/          # Scene 3: Particle fire demo
├── app.ts                  # Application bootstrap
└── main.ts                 # Entry point with fullscreen setup
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Author

[@mivebe](https://github.com/mivebe)
