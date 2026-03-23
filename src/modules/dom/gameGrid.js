import { Gameboard } from "../classes/gameboard";
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
    gridOne.id = 'player-one';
    gridTwo.id = hasComputerPlayer ? 'computer' : 'player-two';
}