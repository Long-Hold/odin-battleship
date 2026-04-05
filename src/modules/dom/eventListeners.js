import { GRID_IDS } from "./gameGrid";

export function initializeButtonListeners(randomizeShips, startGame, playAgain) {
    const gameButtons = document.getElementById('game-buttons');

    gameButtons.addEventListener('click', (event) => {
        const buttonType = event.target.id;
        if (buttonType === 'randomize-ships')
            randomizeShips();
        if (buttonType === 'start-game')
            startGame();
        if (buttonType === 'play-again')
            playAgain();
    });
}

// TODO
export function initializeBoardListeners() {
    const gridsContainer = document.getElementById('game-grids-container');
    gridsContainer.addEventListener('click', (event) => {
        const parentId = event.target.parentElement.id;

        if (!Object.values(GRID_IDS).includes(parentId))
            return;
        
        console.log('TODO');
    });
}