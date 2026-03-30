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
            for (let letter = 'A'.charCodeAt(); letter <= 'J'.charCodeAt(); ++letter) {
                for (let num = 1; num <= 10; ++num) {
                    const coordinate = `${String.fromCharCode(letter)}${num}`;
                    // Player 1's turn
                    expect(() => game.handleAttack(coordinate)).not.toThrow();
                    // Player 2's turn
                    expect(() => game.handleAttack(coordinate)).not.toThrow();

                    // Player 1 now making duplicate guess
                    expect(() => game.handleAttack(coordinate)).toThrow();
                    // Player 2 now making duplicate guess
                    expect(() => game.handleAttack(coordinate)).toThrow();
                }
            }
        });
        test('returns false if a handled attack does not hit a ship', () => {
            for (let letter = 'A'.charCodeAt(); letter <= 'J'.charCodeAt(); ++letter) {
                for (let num = 1; num <= 10; ++num) {
                    const coordinate = `${String.fromCharCode(letter)}${num}`;
                    // Player 1 attacks
                    expect(game.handleAttack(coordinate)).toBe(false);
                    // Player 2 attacks
                    expect(game.handleAttack(coordinate)).toBe(false);
                }
            }
        });
        describe('when passing occupied coordinates', () => {
            let occupiedCoords;
            beforeEach(() => {
                const playerOneGameBoard = playerOne.gameBoard;
                const playerTwoGameBoard = playerTwo.gameBoard;

                const shipPlacements = [
                    { coords: ['A1', 'A2', 'A3', 'A4', 'A5'], type: 'carrier' },
                    { coords: ['B1', 'B2', 'B3', 'B4'],        type: 'battleship' },
                    { coords: ['C1', 'C2', 'C3'],               type: 'destroyer' },
                    { coords: ['D1', 'D2', 'D3'],               type: 'submarine' },
                    { coords: ['E1', 'E2'],                     type: 'patrolboat' },
                ];

                occupiedCoords = shipPlacements.flatMap(({ coords }) => coords);

                for (const { coords, type } of shipPlacements) {
                    playerOneGameBoard.placeShip(coords, type);
                    playerTwoGameBoard.placeShip(coords, type);
                }
            });
            test('returns true if a handled attack does hit a ship', () => {
                for (let i = 0; i < occupiedCoords.length; ++i) {
                    const coord = occupiedCoords[i];
                    // Player 1 attacks player 2
                    expect(game.handleAttack(coord)).toBe(true);
                    // Player 2 attacks player 1
                    expect(game.handleAttack(coord)).toBe(true);
                }
            });
        });
    });
});