# Game Developer Assignment: 5x3 Slot Machine

## Objective
Create a simple 5x3 slot machine game using TypeScript/JavaScript ES6 and Pixi.js. This assignment will test your
ability to work with game development concepts, TypeScript/JavaScript, and the Pixi.js library.

*Good luck with creating your slot machine game!*

## Requirements

### Game Mechanics
1. Implement a 5x3 grid of symbols.
2. Use the provided symbol images for the slot machine.
3. Implement a "Spin" button that randomizes the symbols on the grid.
4. Implement win condition checking for 3+ OAKs (3+ consecutive symbols of the same kind).
5. Game should not have fixed paylines, but use "ways-to-win" system (exact position of the symbols on each reel doesn't matter as long as they appear consecutively from left to right).

**Example Winning Boards:**

(Non-winning symbols are grayed out solely to enhance the visibility of winning symbols. This feature is not required for implementation in your game)

![board1.png](readme%2Fboard1.png)
![board2.png](readme%2Fboard2.png)

### Visual Requirements
1. Use Pixi.js to render the game.
2. Create a basic, visually appealing layout for the slot machine.
3. Implement a spinning reels visualization during the spin action.
4. Implement a simple win animation (e.g., a "bump" or highlight effect on winning symbols).

### Technical Requirements
1. Use TypeScript or JavaScript ES6 for all game logic.
2. Use Pixi.js for rendering and animations.
3. Implement a basic state management system (e.g., idle, spinning, win checking).
4. Ensure the code is well-organized, following object-oriented programming principles.
6. Feel free to install any dependency you might find useful.
7. Feel free to modify any of boilerplate/template files if needed (files on root).
8. During machine spinning, display random symbols on the reels. 
9. Use the provided Outcome.ts class to determine the symbols to be displayed after the machine stops. 

## Build & Development

You will need node setup on your machine.

Then you can run the commands below in order to start the client:

```bash
npm install
npm run serve
```

That will build the game and start a client at http://localhost:8080/. The server has hot reload, so every time you 
update the code, it should rebuild the client and refresh the tab in your preferred web browser.

## Evaluation Criteria
- Code quality, organization, and readability
- Effective use of TypeScript/JavaScript ES6 and Pixi.js
- Correct implementation of required game mechanics
- Quality of spinning reels visualization and win animation
- Overall user experience and game feel

## Submission
Please submit your code as a GitHub repository link or a zip package via email to natalia.c@naileditgames.com.

## Disclaimer

This is a test assignment and no part of your work will be used for purposes other than recruitment

---

# Implementation Notes

## Running

```bash
npm install
npm run serve   # dev server on http://localhost:8080/
npm run build   # production bundle into dist/
npm test        # headless unit tests for the game logic
```

## Structure

| File | Responsibility |
| --- | --- |
| `index.ts` | Application bootstrap, asset loading, scene layout, responsive scaling |
| `src/SlotGame.ts` | Game state machine: idle, spinning, evaluating, presenting |
| `src/Machine.ts` | Owns the five reels, schedules staggered starts and stops, masks the reel window |
| `src/Reel.ts` | Per reel animation: wind up, spin, decelerate, bounce, motion blur |
| `src/ReelStrip.ts` | Pure symbol bookkeeping for one reel, no rendering, unit tested |
| `src/SymbolView.ts` | A single symbol sprite plus its highlight and dim behaviour |
| `src/WinEvaluator.ts` | Ways to win evaluation, pure function of the grid, unit tested |
| `src/WinPresenter.ts` | Win highlight sequence and win label |
| `src/SpinButton.ts` | Button with normal, hover, pressed and disabled textures |
| `src/config.ts` | Grid geometry, timings and tuning constants |
| `src/Outcome.ts` | Provided outcome source, used unchanged |

## How a spin lands on the outcome

`Outcome.resolve()` is called once when the spin starts. While a reel spins it pulls
random symbols, and the moment a stop is requested it queues the three outcome symbols
into the feed that enters from the top of the strip. The reel then decelerates over an
exact whole number of cells, so it always comes to rest with the requested column in the
window and no drift. The deceleration duration is derived from the current speed, which
keeps velocity continuous at the moment the stop begins.

The landing bounce and the wind up are applied as a visual offset only. The logical
position is never overshot, so the board can never end up a cell out of place.

## Ways to win

There are no fixed paylines. For each symbol the evaluator walks the reels from left to
right, collects every row where the symbol appears and stops at the first reel without a
match. Three or more consecutive reels pay, and the number of ways is the product of the
per reel occurrences. Several symbols can pay on the same spin, which is what the two
example boards in the brief show.

## Testing

`npm test` bundles `tests/` for Node and runs it. It covers the ways to win rules,
including both example boards from the brief, and the reel landing logic across a range
of starting positions and stop speeds. There is no test framework dependency.

## Changes to the boilerplate

- `img/index.js` was replaced with `img/index.ts`. The original glob import resolved every
  asset to an empty object at runtime, so `Assets.load` received `src: {}` and never
  settled, leaving a blank screen. Asset URLs are now declared explicitly with
  `new URL('./file.png', import.meta.url)`.
- The `main` field was removed from `package.json`. Parcel refuses to build with a `.ts`
  file in that field.
- The canvas now resizes to the window and the scene is scaled to fit, instead of a fixed
  1920x1080 canvas that overflowed most screens.
- `tsconfig.json` was put into strict mode.
- `@parcel/resolver-glob` is left in `devDependencies` but is no longer used.
