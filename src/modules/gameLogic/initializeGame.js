import { Game } from "../classes/gameInstance";
import { Computer, Player } from "../classes/player";
import { initializeButtonListeners, waitForCoordClick } from "../dom/eventListeners";
import { assignGameGridIDs, createGameGrid, displayShips, GRID_IDS} from "../dom/gameGrid";
import { randomizeShips } from "./gameUtils";
import { runGame } from "./runGame";


/**
 * Initializes the UI DOM elements and internal objects required
 * for gameplay in the following order:
 * 
 * 1. Creates the game grids.
 * 2. Assigns ID's to the game grid elements.
 * 3. Creates Player instances.
 * 4. Creates a Game instance to link Player's with their DOM gameboards.
 * 
 * @param {boolean} hasComputerPlayer - True if Player 2 is a CPU. False is not. 
 * @returns {object} The created Game class instance.
 */
export function initializeGame(hasComputerPlayer = true) {
    createGameGrid();
    assignGameGridIDs(hasComputerPlayer);

    const playerOne = new Player();
    const playerTwo = hasComputerPlayer ? new Computer() : new Player();

    const playerOneBoard = document.querySelector(`#${GRID_IDS.PLAYER_ONE}`);
    const playerTwoBoard = document.querySelector(
        hasComputerPlayer ? `#${GRID_IDS.COMPUTER}` : `#${GRID_IDS.PLAYER_TWO}`
    );

    const game = new Game(
        playerOne, playerOneBoard,
        playerTwo, playerTwoBoard
    );

    return game;
}

/**
 * Attaches event listeners to the buttons that control the game, and passes the
 * respective functions that are called for each button.
 * 
 * @param {object} game - A Game object instance to manipulate an existing game. 
 */
export function initializeGameButtons(game) {
    initializeButtonListeners(
        () => randomizeShips(game, displayShips),
        () => runGame(game, waitForCoordClick),
        () => window.location.reload(),
    );
}