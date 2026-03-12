import { Gameboard } from "../modules/classes/gameboard";

describe('class Gameboard', () => {
    let gameBoard;
    beforeEach(() => {
        gameBoard = new Gameboard();
    });

    describe('static methods', () => {
        describe('Gameboard.isOutOfBounds()', () => {
            test.each([
                [], 123, {}
            ])('returns true when passed non-string param', (input) => {
                expect(Gameboard.isOutOfBounds(input)).toBe(true);
            })
            test('returns true when passed empty or whitespace strings', () => {
                expect(Gameboard.isOutOfBounds('')).toBe(true);
                expect(Gameboard.isOutOfBounds('  ')).toBe(true);
                expect(Gameboard.isOutOfBounds('     ')).toBe(true);
            });
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
        test.each([
            [['A1','A2','A0']],
            [['B-1','B2','B3']],
            [['I1','J1','K1']],
        ])('throws RangeError if coordinates array has invalid coordinate', (coordinates) => {
            expect(() => gameBoard.placeShip(coordinates, 'destroyer')).toThrow(RangeError);
        });
        test.each([
            {coords: ['A1','A2','A3'], ship: 'patrolboat'},
            {coords: ['A1','A2','A3','A4'], ship: 'submarine'},
            {coords: ['A1','A2','A3','A4','A5'], ship:'battleship'},
        ])('throws Error if coordinates array length is larger than ship length', ({coords, ship}) => {
            expect(() => gameBoard.placeShip(coords, ship)).toThrow(Error);
        });
        test('throws Error if a coordinate is already occupied', () => {
            gameBoard.placeShip(['A1','B1','C1'], 'submarine');
            // If first coordinate is occupied
            expect(() => gameBoard.placeShip(['A1','A2','A3'], 'destroyer')).toThrow(Error);
            // If second coordinate is occupied
            expect(() => gameBoard.placeShip(['A1','B1'], 'patrolboat')).toThrow(Error);
            // If third coordinate is occupied
            expect(() => gameBoard.placeShip(['A1','B1','C1','D1'], 'battleship')).toThrow(Error);
        });
        test('throws Error if a duplicate ship is added', () => {
            expect(() => gameBoard.placeShip(['A1','B1'], 'patrolboat')).not.toThrow();
            expect(() => gameBoard.placeShip(['A2','B2'], 'patrolboat')).toThrow(Error);
        });
    });
});