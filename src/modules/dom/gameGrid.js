import { Gameboard } from "../classes/gameboard";

/**
 * Stores the strings that are assigned to the game grid DOM elements.
 * 
 * These are exported so other modules can reference them, and allows a single source
 * to control their names.
 */
export const GRID_IDS = {
    PLAYER_ONE : 'player-one',
    PLAYER_TWO: 'player-two',
    COMPUTER: 'computer',
}

const [gridOne, gridTwo] = document.querySelectorAll('.game-grid');

export function createGameGrid() {
    for (let i = Gameboard.BOUNDS.ROW.START; i <= Gameboard.BOUNDS.ROW.END; ++i) {
        for (let j = Gameboard.BOUNDS.COL.START; j <= Gameboard.BOUNDS.COL.END; ++j) {
            const div = document.createElement('div');
            div.dataset.coordinate = `${String.fromCharCode(j)}${i}`;
            gridOne.appendChild(div.cloneNode(true));
            gridTwo.appendChild(div.cloneNode(true));
        }
    }
}

/**
 * Assigns ID's to the two gameboard elements on the DOM.
 * 
 * The first gameboard is always assumed to be a human player.
 * The seccond gameboard is indicated to be either a human player or a computer player
 * depending on the value of the Boolean paramter.
 * 
 * @param {boolean} hasComputerPlayer - Indicates if this is a Player vs Player or Player vs CPU game.
 */
export function assignGameGridIDs(hasComputerPlayer = true) {
    gridOne.id = GRID_IDS.PLAYER_ONE;
    gridTwo.id = hasComputerPlayer ? GRID_IDS.COMPUTER : GRID_IDS.PLAYER_TWO;
}

export function displayShips(gameBoard, shipPlacements) {
    for (const [coord, ship] of shipPlacements) {
        const coordElement = gameBoard.querySelector(`[data-coordinate="${coord}"]`);
        coordElement.classList.add('has-ship');
    }
}