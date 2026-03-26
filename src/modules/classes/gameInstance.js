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
}