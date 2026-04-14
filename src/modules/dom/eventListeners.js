import { hideAllButtons, showStartGameButton } from "./gameButtons";

export function initializeButtonListeners(randomizeShips, startGame, playAgain) {
    const gameButtons = document.getElementById('game-buttons');

    gameButtons.addEventListener('click', (event) => {
        const buttonType = event.target.id;
        if (buttonType === 'randomize-ships') {
            randomizeShips();
            showStartGameButton();
        }
        if (buttonType === 'start-game') {
            hideAllButtons();
            startGame();
        }
        if (buttonType === 'play-again')
            playAgain();
    });
}

/**
 * Returns a Promise that resolves with the dataset coordinate of the next clicked
 * cell within the game grid container.
 * 
 * @returns {Promise<string>} The coordinate string of the clicked cell.
 */
export function waitForCoordClick() {
    const gridsContainer = document.getElementById('game-grids-container');
    return new Promise((resolve) => {
        gridsContainer.addEventListener('click', (event) => {
            resolve(event.target.dataset.coordinate);
        }, { once: true });
    });
}