import { Game } from "../modules/classes/gameInstance";
import { Player } from "../modules/classes/player";

describe('class Game', () => {
    let playerOne;
    let playerTwo;
    let game;
    beforeEach(() => {
        playerOne = new Player();
        playerTwo = new Player();
        game = new Game(playerOne, null, playerTwo, null);
    });

    describe('Game.handleAttack()', () => {
        test('does not throw any Errors for any coordinate on empty boards', () => {
            for (let letter = 'A'.charCodeAt(); letter <= 'J'.charCodeAt(); ++letter) {
                for (let num = 1; num <= 10; ++num) {
                    const coordinate = `${String.fromCharCode(letter)}${num}`;

                    // Called twice to test for each Player
                    expect(() => game.handleAttack(coordinate)).not.toThrow();
                    expect(() => game.handleAttack(coordinate)).not.toThrow();
                }
            }
        });
        test('gameBoard.guessedSpaces size increases for respective Player after making a move', () => {
            const playerOneGuesses = game.playerOne.player.gameBoard.guessedSpaces;
            const playerTwoGuessess = game.playerTwo.player.gameBoard.guessedSpaces;

            expect(playerOneGuesses.size).toBe(0);
            expect(playerTwoGuessess.size).toBe(0);

            let count = 1;
            for (let letter = 'A'.charCodeAt(); letter <= 'J'.charCodeAt(); ++letter) {
                for (let num = 1; num <= 10; ++num) {
                    const coordinate = `${String.fromCharCode(letter)}${num}`;

                    game.handleAttack(coordinate);
                    expect(playerOneGuesses.size).toBe(count);

                    game.handleAttack(coordinate);
                    expect(playerTwoGuessess.size).toBe(count);

                    ++count;
                }
            }
        });
        test('throws Errors if duplicate coordinate is passed', () => {
            //TODO
        });
    });
});