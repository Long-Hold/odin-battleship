import { Gameboard } from "../modules/classes/gameboard";

describe('class Gameboard', () => {
    let gameBoard;
    beforeEach(() => {
        gameBoard = new Gameboard();
    });

    describe('static methods', () => {
        describe('Gameboard.isOutOfBounds()', () => {
            test('returns true for out-of-bounds X coordinates', () => {
                for (let i = 'A'.charCodeAt(0); i <= 'J'.charCodeAt(0); ++i) {
                    const invalidOne = `${String.fromCharCode(i)}0`;
                    const invalidTwo = `${String.fromCharCode(i)}11`;
                    expect(Gameboard.isOutOfBounds(invalidOne)).toBe(true);
                    expect(Gameboard.isOutOfBounds(invalidTwo)).toBe(true);
                }
            });
            test('returns true for out-of-bounds Y coordinates', () => {
                for (let i = 1; i <= 10; ++i) {
                    const invalidOne = `#${i}`;
                    const invalidTwo = `K${i}`;
                    const invalidThree = `l${i}`;
                    const invalidFour = `M${i}`;
                    const invalidFive = `${i}`;

                    expect(Gameboard.isOutOfBounds(invalidOne)).toBe(true);
                    expect(Gameboard.isOutOfBounds(invalidTwo)).toBe(true);
                    expect(Gameboard.isOutOfBounds(invalidThree)).toBe(true);
                    expect(Gameboard.isOutOfBounds(invalidFour)).toBe(true);
                    expect(Gameboard.isOutOfBounds(invalidFive)).toBe(true);
                }
            });
            test('returns false for all valid coordinates', () => {
                for (let i = 'A'.charCodeAt(0); i < 'J'.charCodeAt(0); ++i) {
                    for (let j = 1; j <= 10; ++j) {
                        const coordinate = `${String.fromCharCode(i)}${j}`;
                        expect(Gameboard.isOutOfBounds(coordinate)).toBe(false);
                    }
                }
            });
            test('returns false for valid coordinates when lowercase', () => {
                for (let i = 'a'.charCodeAt(0); i < 'j'.charCodeAt(0); ++i) {
                    for (let j = 1; j <= 10; ++j) {
                        const coordinate = `${String.fromCharCode(i)}${j}`;
                        expect(Gameboard.isOutOfBounds(coordinate)).toBe(false);
                    }
                }
            });
        });
    });


    describe('Gameboard.placeShip()', () => {
        test('throws TypeError if coordinates are not an array', () => {
            expect(() => gameBoard.placeShip('A1A2A3', 'submarine')).toThrow(TypeError);
        });
    });

    describe('Gameboard.receiveAttack()', () => {
        test.each(
            [1, [], new String(), null]
        )('throws TypeError for non-string parameter', (input) => {
            expect(() => gameBoard.receiveAttack(input)).toThrow(TypeError);
        });
        test.each(
            ['', '  ', '         ']
        )('throws Error when passed whitespace or empty strings', (input) => {
            expect(() => gameBoard.receiveAttack(input)).toThrow(Error);
        });
    });
});