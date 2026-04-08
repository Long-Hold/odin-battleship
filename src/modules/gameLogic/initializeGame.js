import { Game } from "../classes/gameInstance";
import { Computer, Player } from "../classes/player";
import { initializeButtonListeners, initializeBoardListeners } from "../dom/eventListeners";
import { assignGameGridIDs, createGameGrid, displayShips, GRID_IDS} from "../dom/gameGrid";


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

    initializeButtonListeners(
        () => {
            playerOne.randomizeShipPlacements();
            playerTwo.randomizeShipPlacements();
            displayShips(
                game.playerOne.board,
                [...playerOne.gameBoard.shipPlacements.keys()] 
            );
            displayShips(
                game.playerTwo.board,
                [...playerTwo.gameBoard.shipPlacements.keys()]
            );
        }
    );

    return game;
}