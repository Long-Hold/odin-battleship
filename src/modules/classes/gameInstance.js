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

    /**
     * Takes a coordinate string and has the attacking Player Class record the coordinate, and
     * the Player Class being attacked check if the coordinate has a ship on that space.
     * 
     * The Player Class that is considered attacking is determined by comparing how many attacks
     * each Player has made.
     * 
     * If both Players have the same amount of attacks made, then it is Player 1's turn.
     * Otherwise, it is Player 2's turn.
     * 
     * @param {string} coordinate - The coordinate of the opposing board to attack. 
     * @returns {boolean} True if a ship was hit. False if not.
     */
    handleAttack(coordinate) {
        const playerOneTurnCount = this.playerOne.player.gameBoard.guessedSpaces.size;
        const playerTwoTurnCount = this.playerTwo.player.gameBoard.guessedSpaces.size;

        /**
         * The player that gets to make a turn can be determined by how many turns they have taken.
         * 
         * If both players have the same amount of turns, then player 1 places the next attack.
         * Otherwise, player 2 goes.
         */

        if (playerOneTurnCount === playerTwoTurnCount) {
            this.playerOne.player.gameBoard.recordPlacedAttack(coordinate);
            return this.playerTwo.player.gameBoard.receiveAttack(coordinate);
        } else {
            this.playerTwo.player.gameBoard.recordPlacedAttack(coordinate);
            return this.playerOne.player.gameBoard.receiveAttack(coordinate);
        }
    }

    /**
     * Determines which Player's turn it is by comparing the amount of turns each Player has made.
     * 
     * If the turn count is equal for both Players, then it is Player 1's turn.
     * Otherwise it is Player 2's turn.
     * 
     * @returns {object} The Player Object representing the current player.
     */
    getCurrentPlayer() {
        const playerOneTurnCount = this.playerOne.player.gameBoard.guessedSpaces.size;
        const playerTwoTurnCount = this.playerTwo.player.gameBoard.guessedSpaces.size;

        if (playerOneTurnCount === playerTwoTurnCount)
            return this.playerOne.player;
        else
            return this.playerTwo.player;
    }
}