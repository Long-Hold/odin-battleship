import { showPlayAgainButton } from "../dom/gameButtons";
import { lockGameBoards, setGridSquareStatus, showEndGameScreen, swapBoardLock } from "../dom/gameGrid";

export async function runGame(game, coordinateRetriever) {
    const playerOne = game.playerOne.player;
    const playerTwo = game.playerTwo.player;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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

        let coord = null;
        if (game.getCurrentPlayer() === playerOne)
            coord = await coordinateRetriever();
        else {
            await sleep(500);
            coord = playerTwo.getAttack();
        }

        let attackResult = null;
        try {
            attackResult = game.handleAttack(coord);
        } catch (error) {
            console.error(error);
            continue;
        }

        setGridSquareStatus(opponent.board, coord, attackResult);

        /**
         * If the CPU's attack hit the opponents ship, then it will calculate it's next moves
         * intelligently to finish that ship off
         */
        if (current.player === playerTwo && attackResult === true)
            playerTwo.queueAdjacentAttacks(coord);

        /**
         * Gets the board of the players on the DOM and show the winner / loser message
         * on each board respectively.
         */
        if (playerOne.gameBoard.allShipsSunk() || playerTwo.gameBoard.allShipsSunk()) {
            lockGameBoards();
            const [winningBoard, losingBoard] = playerOne.gameBoard.allShipsSunk()
            ? [game.playerTwo.board, game.playerOne.board]
            : [game.playerOne.board, game.playerTwo.board];  

            showEndGameScreen(winningBoard, losingBoard);
            break;
        }
    }
    showPlayAgainButton();
}