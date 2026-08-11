# GONG Game Demo
This animation minigame is made as an interview home task for GONG Gaming Technologies

## Project Structure

```
spine-project/
├── index.html   - Entry point
├── style.css    - All styles
├── app.js       - OOP application logic
└── README.md    - This file
```

## How it works

1. **FadeImage** - Uses GSAP to fade the hero image in over 2.2 s.  
2. **Button** - Appears (with a pop-in animation) once the fade is complete.  
3. **SpineAnimation** - On button click, opens a full-screen overlay and plays the *Spineboy* skeleton from Esoteric Software's public demo server using the official `@esotericsoftware/spine-player` package.  
4. **App** - Orchestrates the three classes above.

## Running locally

Just open `index.html` in a browser - no build step needed.  
All dependencies are loaded from CDN:

| Library | CDN |
|---------|-----|
| GSAP 3.12 | cdnjs.cloudflare.com |
| spine-player 4.1 | unpkg.com |

> **Note:** The Spine skeleton is fetched from `esotericsoftware.com`.  
> An active internet connection is required.

## OOP Classes

| Class | Responsibility |
|-------|---------------|
| `FadeImage` | Wraps GSAP fade-in for the hero `<img>` |
| `Button` | Wraps a DOM button; handles show/hide + click callback |
| `SpineAnimation` | Creates / destroys the `spine.SpinePlayer` instance |
| `App` | Wires all classes together and boots the experience |
