# Battleship

A browser-based implementation of the classic Battleship board game, built with vanilla JavaScript and bundled with Webpack. Playable as a single-player game against a computer opponent with basic targeting AI.

## Live Demo

[Add link here]

## Features

- Player vs. Computer gameplay on a 10×10 grid
- Computer opponent with multi-stage targeting logic: random search, adjacent probing on a hit, axis locking on a second hit, and direction reversal on a miss
- Randomized ship placement for both players
- Ship sprites rendered and repositioned dynamically on grid resize
- Hit, miss, and sunk visual states per grid square
- Victory and defeat end-screen messaging

## Ships

| Ship        | Length |
|-------------|--------|
| Carrier     | 5      |
| Battleship  | 4      |
| Destroyer   | 3      |
| Submarine   | 3      |
| Patrol Boat | 2      |

## Getting Started

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build
```

## Running Tests

Tests are written with Jest and cover the `Ship`, `Gameboard`, `Player`, `Computer`, and `Game` classes.

```bash
npm test
```

## Project Structure

```
src/
├── index.js
├── template.html
├── modules/
│   ├── classes/
│   │   ├── ship.js
│   │   ├── gameboard.js
│   │   ├── player.js          # Player and Computer classes
│   │   └── gameInstance.js    # Game class, turn management
│   ├── dom/
│   │   ├── eventListeners.js
│   │   ├── gameButtons.js
│   │   ├── gameGrid.js
│   │   └── gameSprites.js
│   └── gameLogic/
│       ├── initializeGame.js
│       ├── runGame.js
│       └── gameUtils.js
└── tests/
    ├── ship.test.js
    ├── gameboard.test.js
    ├── player.test.js
    ├── computer.test.js
    └── gameInstance.test.js
```

## Design Notes

The game loop in `runGame.js` uses `async/await` with a promise-based click listener (`waitForCoordClick`) to pause execution between the player's turns without blocking the main thread. The computer's turn uses a short `setTimeout` delay to make the alternation feel natural in the UI.

The `Computer` class maintains a private `#targeting` object that tracks the initial hit coordinate, the inferred ship axis, the current attack direction, and a queue of candidate coordinates. This state is cleared when a ship is confirmed sunk.

## Acknowledgements

Built as part of [The Odin Project](https://www.theodinproject.com) curriculum.