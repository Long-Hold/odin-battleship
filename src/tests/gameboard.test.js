import { Gameboard } from "../modules/classes/gameboard";

describe('class Gameboard', () => {
    let gameBoard;
    beforeEach(() => {
        gameBoard = new Gameboard();
    });

    describe('Gameboard.placeShip()', () => {
        test.each(
            [1, [], new String(), null]
        )('throws TypeError for non-string parameter', (input) => {
            expect(() => gameBoard.placeShip(input)).toThrow(TypeError);
        });
        test.each(
            ['', '  ', '         ']
        )('throws Error when passed whitespace or empty strings', (input) => {
            expect(() => gameBoard.placeShip(input)).toThrow(Error);
        });
        test('throws RangeError for out-of-bounds X coordinates', () => {
            for (let i = 'A'.charCodeAt(0); i <= 'J'.charCodeAt(0); ++i) {
                const invalidOne = `${String.fromCharCode(i)}0`;
                const invalidTwo = `${String.fromCharCode(i)}11`;
                expect(() => gameBoard.placeShip(invalidOne)).toThrow(RangeError);
                expect(() => gameBoard.placeShip(invalidTwo)).toThrow(RangeError);
            }
        });
        test('throws RangeError for out-of-bounds Y coordinates', () => {
            for (let i = 1; i <= 10; ++i) {
                const invalidOne = `#${i}`;
                const invalidTwo = `K${i}`;
                const invalidThree = `l${i}`;
                const invalidFour = `M${i}`;
                const invalidFive = `${i}`;

                expect(() => gameBoard.placeShip(invalidOne)).toThrow(RangeError);
                expect(() => gameBoard.placeShip(invalidTwo)).toThrow(RangeError);
                expect(() => gameBoard.placeShip(invalidThree)).toThrow(RangeError);
                expect(() => gameBoard.placeShip(invalidFour)).toThrow(RangeError);
                expect(() => gameBoard.placeShip(invalidFive)).toThrow(RangeError);
            }
        });
        test('does not throw any errors for valid coordinates', () => {
            for (let i = 'A'.charCodeAt(0); i < 'J'.charCodeAt(0); ++i) {
                for (let j = 1; j <= 10; ++j) {
                    const coordinate = `${String.fromCharCode(i)}${j}`;
                    expect(() => gameBoard.placeShip(coordinate)).not.toThrow();
                }
            }
        });
        test('does not throw any errors for valid coordinates when lowercase', () => {
            for (let i = 'a'.charCodeAt(0); i < 'j'.charCodeAt(0); ++i) {
                for (let j = 1; j <= 10; ++j) {
                    const coordinate = `${String.fromCharCode(i)}${j}`;
                    expect(() => gameBoard.placeShip(coordinate)).not.toThrow();
                }
            }
        });
    });
});