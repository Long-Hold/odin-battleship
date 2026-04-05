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
        describe('Gameboard.getRandomCoordinate()', () => {
            test('returned string is a valid Gameboard coordinate', () => {
                for (let i = 0; i < 1000; ++i) {
                    const coordinate = Gameboard.getRandomCoordinate();
                    expect(Gameboard.isOutOfBounds(coordinate)).toBe(false);
                }
            });
        })
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
        test('does not throw when adding valid ships and placements', () => {
            expect(() => gameBoard.placeShip(['a1','a2'], 'patrolboat')).not.toThrow();
            expect(() => gameBoard.placeShip(['J10', 'i10','H10'], 'Submarine')).not.toThrow();
            expect(() => gameBoard.placeShip(['J6', 'J7', 'J8'], 'DESTROYER')).not.toThrow();
            expect(() => gameBoard.placeShip(['A3','A4','A5','a6'], 'bAttleShip  ')).not.toThrow();
            expect(() => gameBoard.placeShip(['c8','D8','e8','f8','G8'], '  CarRier ')).not.toThrow();
        });
    });

    describe('Gameboard.receiveAttack()', () => {
        test.each([
            'A0', 'A11', 'J0', 'J11', 'K4', {}, '', '  ', 123.23
        ])('throws RangeError for invalid coordinates', (input) => {
            expect(() => gameBoard.receiveAttack(input)).toThrow(RangeError);
        });

        beforeEach(() => {
            gameBoard.placeShip(['A1','A2'], 'patrolboat');
            gameBoard.placeShip(['J10', 'I10','H10'], 'Submarine');
            gameBoard.placeShip(['J6', 'J7', 'J8'], 'DESTROYER');
            gameBoard.placeShip(['A3','A4','A5','A6'], 'bAttleShip  ');
            gameBoard.placeShip(['C8','D8','E8','F8','G8'], '  CarRier ');
        });

        test('returns false if no ship was on passed coordinate', () => {
            expect(gameBoard.receiveAttack('A7')).toBe(false);
            expect(gameBoard.receiveAttack('G10')).toBe(false);
            expect(gameBoard.receiveAttack('b7')).toBe(false);
            expect(gameBoard.receiveAttack('A1')).not.toBe(false);
        });
        
        test('returns true if ship was present on coordinate', () => {
            expect(gameBoard.receiveAttack('A1')).toBe(true);
            expect(gameBoard.receiveAttack('E8')).toBe(true);
            expect(gameBoard.receiveAttack('J7')).toBe(true);
        });
    });

    describe('Gameboard.recordPlacedAttack()', () => {
        test('throws RangeError when passed invalid coordinate string', () => {
            expect(() => gameBoard.recordPlacedAttack('a11')).toThrow(RangeError);
            expect(() => gameBoard.recordPlacedAttack('')).toThrow(RangeError);
            expect(() => gameBoard.recordPlacedAttack('K1')).toThrow(RangeError);
        });
        test('does not throw when passed unique coordinate, then throws when passed duplicate', () => {
            expect(() => gameBoard.recordPlacedAttack('A1')).not.toThrow();
            expect(() => gameBoard.recordPlacedAttack('b10')).not.toThrow();
            expect(() => gameBoard.recordPlacedAttack('c9')).not.toThrow();

            expect(() => gameBoard.recordPlacedAttack('a1')).toThrow(Error);
            expect(() => gameBoard.recordPlacedAttack('B10')).toThrow(Error);
            expect(() => gameBoard.recordPlacedAttack('C9')).toThrow(Error);
        });
    });

    describe('Gameboard.allShipsSunk()', () => {
        beforeEach(() => {
            gameBoard.placeShip(['A1','A2'], 'patrolboat');
            gameBoard.placeShip(['J10', 'I10','H10'], 'Submarine');
            gameBoard.placeShip(['J6', 'J7', 'J8'], 'DESTROYER');
            gameBoard.placeShip(['A3','A4','A5','A6'], 'bAttleShip  ');
            gameBoard.placeShip(['C8','D8','E8','F8','G8'], '  CarRier ');
        });
        test('returns false if no ships are sunk', () => {
            expect(gameBoard.allShipsSunk()).toBe(false);
        });
        test('returns false if only some ships are sunk', () => {
            gameBoard.receiveAttack('A1');
            gameBoard.receiveAttack('A2');

            gameBoard.receiveAttack('J6');
            gameBoard.receiveAttack('J7');
            gameBoard.receiveAttack('J8');

            expect(gameBoard.allShipsSunk()).toBe(false);
        });
        test('returns true if every ship is sunk', () => {
            gameBoard.receiveAttack('A1');
            gameBoard.receiveAttack('A2');
            gameBoard.receiveAttack('J10');
            gameBoard.receiveAttack('I10');
            gameBoard.receiveAttack('H10');
            gameBoard.receiveAttack('J6');
            gameBoard.receiveAttack('J7');
            gameBoard.receiveAttack('J8');
            gameBoard.receiveAttack('A3');
            gameBoard.receiveAttack('A4');
            gameBoard.receiveAttack('A5');
            gameBoard.receiveAttack('A6');
            gameBoard.receiveAttack('C8');
            gameBoard.receiveAttack('D8');
            gameBoard.receiveAttack('E8');
            gameBoard.receiveAttack('F8');
            gameBoard.receiveAttack('G8');
            expect(gameBoard.allShipsSunk()).toBe(true);
        });
    });

    describe('Gameboard.reset()', () => {
        test('clears all the class properties', () => {
            gameBoard.placeShip(['A1','A2'], 'patrolboat');
            gameBoard.placeShip(['J10', 'I10','H10'], 'Submarine');
            gameBoard.placeShip(['J6', 'J7', 'J8'], 'DESTROYER');
            gameBoard.placeShip(['A3','A4','A5','A6'], 'bAttleShip  ');
            gameBoard.placeShip(['C8','D8','E8','F8','G8'], '  CarRier ');
            expect(gameBoard.shipPlacements.size).not.toBe(0);
            gameBoard.reset();
            expect(gameBoard.shipPlacements.size).toBe(0);
        });
    });
});