export class Game {
    constructor(playerOne, gameBoardOne, playerTwo, gameBoardTwo) {
        this.playerOne = {
            player: playerOne,
            board: gameBoardOne,
        }

        this.playerTwo = {
            player: playerTwo,
            board: gameBoardTwo,
        }
    }

    handleAttack(coordinate) {
        const playerOneTurnCount = this.playerOne.player.gameBoard.guessedSpaces.size;
        const playerTwoTurnCount = this.playerTwo.player.gameBoard.guessedSpaces.size;

        /**
         * THe player that gets to make a turn can be determined by how many turns they have taken.
         * 
         * If both players have the same amount of turns, then player 1 places the next attack.
         * Otherwise, player 2 goes.
         */

        /**
         * TODO:
         *  - Record the return value of receiveAttack to tell DOM what icon to use on grid (hit or miss)
         */
        if (playerOneTurnCount === playerTwoTurnCount) {
            try {
                this.playerOne.player.gameBoard.recordPlacedAttack(coordinate);
                this.playerTwo.player.gameBoard.receiveAttack(coordinate);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                this.playerTwo.player.gameBoard.recordPlacedAttack(coordinate);
                this.playerOne.player.gameBoard.receiveAttack(coordinate);
            } catch (error) {
                console.error(error);
            }
        }
    }
}