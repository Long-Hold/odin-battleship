import { displayShips } from "./gameGrid";

/**
 * Attaches a ResizeObserver object to the game grid elements on the DOM
 * so that the ship sprites can be appropriately resized in the event their parent
 * element is resized.
 * 
 * I do this because the ship sprites are placed using position: absolute, and would
 * otherwise retain persistent dimensions even if the DOM / viewport is resized.
 * 
 * @param {import("../classes/gameInstance").Game} game - An instance of a Game class to retrieve the gameboard from
 */
export function initializeGridResizeObserver(game) {
    const playerOne = game.playerOne.player;
    const playerTwo = game.playerTwo.player;
    const playerOneBoard = game.playerOne.board;
    const playerTwoBoard = game.playerTwo.board;

    const observer = new ResizeObserver(() => {
        if (playerOne.gameBoard.shipPlacements.size === 0) return;
        displayShips(playerOneBoard, playerOne.gameBoard.shipPlacements, playerOne.gameBoard.shipAxis);
        displayShips(playerTwoBoard, playerTwo.gameBoard.shipPlacements, playerTwo.gameBoard.shipAxis);
    });
    observer.observe(playerOneBoard);
}