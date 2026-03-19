import { Gameboard } from "../classes/gameboard";

export function createGameGrid() {
    const [gridOne, gridTwo] = document.querySelectorAll('.game-grid');

    for (let i = Gameboard.BOUNDS.ROW.START; i <= Gameboard.BOUNDS.ROW.END; ++i) {
        for (let j = Gameboard.BOUNDS.COL.START; j <= Gameboard.BOUNDS.COL.END; ++j) {
            const div = document.createElement('div');
            div.dataset.coordinate = `${String.fromCharCode(j)}${i}`;
            gridOne.appendChild(div.cloneNode(true));
            gridTwo.appendChild(div.cloneNode(true));
        }
    }
}