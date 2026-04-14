const GAME_BTNS = document.getElementById('game-buttons');

/**
 * Makes the button that starts the game visible by remove a CSS class.
 */
export function showStartGameButton() {
    const startGameBtn = GAME_BTNS.querySelector('#start-game');
    startGameBtn.classList.remove('hidden');
}

/**
 * Makes the button that allows replays visible by removing a CSS class.
 */
export function showPlayAgainButton() {
    const playAgainBtn = GAME_BTNS.querySelector('#play-again');
    playAgainBtn.classList.remove('hidden');
}

/**
 * Hides all game buttons by applying a CSS class.
 */
export function hideAllButtons() {
    const gameBtns = GAME_BTNS.querySelectorAll('.game-button');
    gameBtns.forEach(button => button.classList.add('hidden'));
}