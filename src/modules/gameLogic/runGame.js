import { swapBoardLock } from "../dom/gameGrid";

export async function runGame(game, coordinateRetriever) {
    const playerOne = game.playerOne.player;
    const playerTwo = game.playerTwo.player;

    while (true) {
        /**
         * Locks the board of the current player, and unlocks the opponent player's
         * board.
         * 
         * This is to prevent the current player making a selection on their own board.
         */
        const [current, opponent] = game.getCurrentPlayer() === playerOne
        ? [game.playerOne, game.playerTwo]
        : [game.playerTwo, game.playerOne];
        swapBoardLock(current.board, opponent.board);

        console.log('waiting for click...');
        const coord = await coordinateRetriever();
        console.log(coord);

        try {
            game.handleAttack(coord);
        } catch (error) {
            console.error(error);
            continue;
        }

        if (playerOne.gameBoard.allShipsSunk() || playerTwo.gameBoard.allShipsSunk()) {
            const losingPlayer = playerOne.gameBoard.allShipsSunk() ? 'Player One' : 'Player Two';
            alert(`Game over! Loser: ${losingPlayer}`);
            break;
        }
    }
}