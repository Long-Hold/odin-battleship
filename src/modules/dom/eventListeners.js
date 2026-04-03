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