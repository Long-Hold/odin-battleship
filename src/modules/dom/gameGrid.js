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

/**
 * Constructs the HTML Elements that represent an interactable game grid.
 * 
 * Construction includes:
 * 1. The Letter and Number coordinate bars
 * 2. The interactable grid squares.
 */
export function createGameGrid() {
    function createGridCoordinates() {
        const [lettersOne, lettersTwo] = document.querySelectorAll('.grid-letters');
        const [numbersOne, numbersTwo] = document.querySelectorAll('.grid-numbers');

        for (let letter = Gameboard.BOUNDS.COL.START; letter <= Gameboard.BOUNDS.COL.END; ++letter) {
            const div = document.createElement('div');
            div.dataset.letter = String.fromCharCode(letter);
            div.textContent = String.fromCharCode(letter);
            lettersOne.appendChild(div.cloneNode(true));
            lettersTwo.appendChild(div.cloneNode(true));
        }

        for (let number = Gameboard.BOUNDS.ROW.START; number <= Gameboard.BOUNDS.ROW.END; ++number) {
            const div = document.createElement('div');
            div.dataset.number = number;
            div.textContent = number;
            numbersOne.appendChild(div.cloneNode(true));
            numbersTwo.appendChild(div.cloneNode(true));
        }
    }
    function createGridSpaces() {
        const [squaresOne, squaresTwo] = document.querySelectorAll('.grid-squares')
        squaresOne.replaceChildren();
        squaresTwo.replaceChildren();
        for (let i = Gameboard.BOUNDS.ROW.START; i <= Gameboard.BOUNDS.ROW.END; ++i) {
            for (let j = Gameboard.BOUNDS.COL.START; j <= Gameboard.BOUNDS.COL.END; ++j) {
                const div = document.createElement('div');
                div.dataset.coordinate = `${String.fromCharCode(j)}${i}`;
                squaresOne.appendChild(div.cloneNode(true));
                squaresTwo.appendChild(div.cloneNode(true));
            }
        }
    }
    createGridCoordinates();
    createGridSpaces();
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

/**
 * Assigns a class to each coordinate occupied by a ship. This class
 * makes the square visible to represent a ship is present there.
 * 
 * Before displaying the ships, any coordinate marked as occupied will first have
 * it removed from it's class list.
 * 
 * @param {HTMLElement} gameBoard - The element that represents the Gameboard. 
 * @param {string[]} shipPlacements - An array of coordinates.
 */
export function displayShips(gameBoard, shipPlacements) {
    const occupiedCoords = gameBoard.querySelectorAll('.has-ship');
    for (let i = 0; i < occupiedCoords.length; ++i)
        occupiedCoords[i].classList.remove('has-ship');

    for (let i = 0; i < shipPlacements.length; ++i) {
        const coord = shipPlacements[i];
        const coordElement = gameBoard.querySelector(`[data-coordinate="${coord}"]`);
        coordElement.classList.add('has-ship');
    }
}

/**
 * Locks a gameboard to prevent user interaction, while unlocking the other one.
 * This is done by assigning / removing a custom class from the passed elements.
 * 
 * @param {HTMLElement} boardToLock - The game grid element to lock.
 * @param {HTMLElement} boardToUnlock - The game grid element to unlock.
 */
export function swapBoardLock(boardToLock, boardToUnlock) {
    boardToLock.classList.add('locked');
    boardToUnlock.classList.remove('locked');
}

/**
 * Adds a class to a single grid square. The class applied depends if the square
 * is a hit or miss.
 * 
 * @param {HTMLElement} board - The opponent's board to add an icon to
 * @param {string} coord - The coordinate of the square to add an icon to
 * @param {boolean} isHit - The result of the attack to determine which icon is used
 */
export function setGridSquareStatus(board, coord, isHit) {
    const gridSquare = board.querySelector(`[data-coordinate="${coord}"]`);

    gridSquare.classList.add(isHit ? 'hit' : 'miss');
}