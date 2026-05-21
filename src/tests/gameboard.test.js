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
        });
        describe('Gameboard.getAdjacentCoordinates()', () => {
            test.each([
                'A11', 'K1', '', '  ', 1, [], null
            ])('returns an empty array when passed an invalid coordinate', (input) => {
                const coordArray = Gameboard.getAdjacentCoordinates(input);
                expect(coordArray.length).toBe(0);
            });
            test.each([
                {coord: 'A1', length: 2, adjCoords: ['B1', 'A2']},
                {coord: 'J10', length: 2, adjCoords: ['J9', 'I10']},
                {coord: 'e4', length: 4, adjCoords: ['E3', 'E5', 'F4', 'D4']},
                {coord: 'F1', length: 3, adjCoords: ['F2', 'G1', 'E1']},
                {coord: 'C10', length: 3, adjCoords: ['C9', 'B10', 'D10']},
                {coord: 'A5', length: 3, adjCoords: ['A4', 'B5', 'A6']},
                {coord: 'J3', length: 3, adjCoords: ['J2', 'I3', 'J4']}
            ])('expect $coord to have length: $length and adjacent coords of $adjCoords', ({coord, length, adjCoords}) => {
                const adjacentCoordinates = Gameboard.getAdjacentCoordinates(coord);
                expect(adjacentCoordinates.length).toBe(length);

                adjacentCoordinates.sort();
                adjCoords.sort();
                
                for (let i = 0; i < adjacentCoordinates.length; ++i) 
                    expect(adjacentCoordinates[i]).toBe(adjCoords[i]);
            });
        });
        describe('Gameboard.getAxisDirection()', () => {
            test.each([
                ['a10', 'a10'],
                ['J10', 'j10'],
                ['B5', 'B5']
            ])('throws Error if both coordinates are the same', (start, end) => {
                expect(() => Gameboard.getAxisDirection(start, end)).toThrow(Error);
            });
            test('throws Error when one or both parameters are invalid coordinates', () => {
                const invalidOne = 'A0';
                const invalidTwo = 'K8';
                const validOne = 'B4';
                const validTwo = 'B5';
                
                // Both params invalid
                expect(() => Gameboard.getAxisDirection(invalidOne, invalidTwo)).toThrow(Error);

                // First param invalid
                expect(() => Gameboard.getAxisDirection(invalidOne, validTwo)).toThrow(Error);

                // Second param invalid
                expect(() => Gameboard.getAxisDirection(validOne, invalidTwo)).toThrow(Error);

                //Neither param invalid
                expect(() => Gameboard.getAxisDirection(validOne, validTwo)).not.toThrow();
            });
            test.each([
                ['A1', 'J10'],
                ['A10', 'J1'],
                ['c3', 'b2']
            ])('throws Error when passed diagonal coordinates', (start, end) => {
                expect(() => Gameboard.getAxisDirection(start, end)).toThrow(Error);
            });
            test.each([
                ['a1', 'j1'],
                ['C4', 'C3'],
                ['J5', 'B5']
            ])('does not throw when passed coordinates on the same axis', (start, end) => {
                expect(() => Gameboard.getAxisDirection(start, end)).not.toThrow();
            });
            test.each([
                {start: 'A1', end: 'C1', axis: 'NUMBER'},
                {start: 'D5', end: 'D10', axis: 'LETTER'},
                {start: 'J9', end: 'J3', axis: 'LETTER'},
                {start: 'E10', end: 'D10', axis: 'NUMBER'},
            ])('[$start, $end] return the axis direction: $axis', ({start, end, axis}) => {
                expect(Gameboard.getAxisDirection(start, end)).toBe(axis);
            });
        });
        describe('Gameboard.getSiblingCoordinate()', () => {
            test('throws Error for invalid axis', () => {
                expect(() => Gameboard.getSiblingCoordinate('A1', 'LETTER', 'ASCENDING')).not.toThrow();
                expect(() => Gameboard.getSiblingCoordinate('F8', 'NUMBER', 'DESCENDING')).not.toThrow();
                expect(() => Gameboard.getSiblingCoordinate('J10', 'ROW', 'ASCENDING')).toThrow(Error);
            });
            test('throws Error for invalid direction', () => {
                expect(() => Gameboard.getSiblingCoordinate('A1', 'LETTER', 'ASCENDING')).not.toThrow();
                expect(() => Gameboard.getSiblingCoordinate('F8', 'NUMBER', 'DESCENDING')).not.toThrow();
                expect(() => Gameboard.getSiblingCoordinate('A1', 'LETTER', 'increase')).toThrow(Error);
            });
            describe('return values for reference coordinates facing LETTER axis', () => {
                test.each([
                    {referenceCoord: 'A1', referenceAxis: 'LETTER', siblingDir: 'ASCENDING', expected: 'A2'},
                    {referenceCoord: 'J9', referenceAxis: 'LETTER', siblingDir: 'ASCENDING', expected: 'J10'},
                    {referenceCoord: 'F6', referenceAxis: 'LETTER', siblingDir: 'ASCENDING', expected: 'F7'},
                    {referenceCoord: 'A10', referenceAxis: 'LETTER', siblingDir: 'DESCENDING', expected: 'A9'},
                    {referenceCoord: 'C2', referenceAxis: 'LETTER', siblingDir: 'DESCENDING', expected: 'C1'},
                    {referenceCoord: 'H7', referenceAxis: 'LETTER', siblingDir: 'DESCENDING', expected: 'H6'},
                    {referenceCoord: 'J10', referenceAxis: 'LETTER', siblingDir: 'ASCENDING', expected: null},
                    {referenceCoord: 'E10', referenceAxis: 'LETTER', siblingDir: 'ASCENDING', expected: null},
                    {referenceCoord: 'E1', referenceAxis: 'LETTER', siblingDir: 'DESCENDING', expected: null},
                    {referenceCoord: 'A1', referenceAxis: 'LETTER', siblingDir: 'DESCENDING', expected: null},
                ])('returns $expected when passed $referenceCoord and $siblingDir', ({referenceCoord, referenceAxis, siblingDir, expected}) => {
                    expect(Gameboard.getSiblingCoordinate(referenceCoord, referenceAxis, siblingDir)).toBe(expected);
                });
            });
            describe('return values for reference coordinates facing NUMBER axis', () => {
                test.each([
                    {referenceCoord: 'A1', referenceAxis: 'NUMBER', siblingDir: 'ASCENDING', expected: 'B1'},
                    {referenceCoord: 'I10', referenceAxis: 'NUMBER', siblingDir: 'ASCENDING', expected: 'J10'},
                    {referenceCoord: 'E6', referenceAxis: 'NUMBER', siblingDir: 'ASCENDING', expected: 'F6'},
                    {referenceCoord: 'B9', referenceAxis: 'NUMBER', siblingDir: 'DESCENDING', expected: 'A9'},
                    {referenceCoord: 'J1', referenceAxis: 'NUMBER', siblingDir: 'DESCENDING', expected: 'I1'},
                    {referenceCoord: 'D2', referenceAxis: 'NUMBER', siblingDir: 'DESCENDING', expected: 'C2'},
                    {referenceCoord: 'J10', referenceAxis: 'NUMBER', siblingDir: 'ASCENDING', expected: null},
                    {referenceCoord: 'A10', referenceAxis: 'NUMBER', siblingDir: 'DESCENDING', expected: null},
                ])('returns $expected when passed $referenceCoord and $siblingDir', ({referenceCoord, referenceAxis, siblingDir, expected}) => {
                    expect(Gameboard.getSiblingCoordinate(referenceCoord, referenceAxis, siblingDir)).toBe(expected);
                });
            });
        });
        describe('Gameboard.getCoordinateDirection()', () => {
            test.each([
                // On the same axis
                {start: 'A1', end: 'A2', result: 'ASCENDING'},
                {start: 'A2', end: 'A1', result: 'DESCENDING'},

                // Different letters
                {start: 'A1', end: 'B1', result: 'ASCENDING'},
                {start: 'B1', end: 'A1', result: 'DESCENDING'},

                // Different letters and values
                {start: 'B4', end: 'E7', result: 'ASCENDING'},
                {start: 'E7', end: 'B4', result: 'DESCENDING'},

                // Check for string comparison with near similar numeric values
                {start: 'J9', end: 'J10', result: 'ASCENDING'},
                {start : 'J10', end: 'J9', result: 'DESCENDING'},

                // lower case
                {start: 'b9', end: 'c10', result: 'ASCENDING'},
                {start: 'c10', end: 'b9', result: 'DESCENDING'},

                // Boundary coordinates
                { start: 'A1', end: 'J10', result: 'ASCENDING' },
                { start: 'J10', end: 'A1', result: 'DESCENDING' },
            ])('returns $result for [$start, $end]', ({start, end, result}) => {
                expect(Gameboard.getCoordinateDirection(start, end)).toBe(result);
            });
            test('throws Error when passed duplicate coordinates', () => {
                expect(() => Gameboard.getCoordinateDirection('A1','A1')).toThrow(Error);
                expect(() => Gameboard.getCoordinateDirection('j10', 'J10')).toThrow(Error);
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

        test('receiveAttack.isHit returns False if no ship was on passed coordinate', () => {
            expect(gameBoard.receiveAttack('A7').isHit).toBe(false);
            expect(gameBoard.receiveAttack('G10').isHit).toBe(false);
            expect(gameBoard.receiveAttack('b7').isHit).toBe(false);
            expect(gameBoard.receiveAttack('A1').isHit).not.toBe(false);
        });
        
        test('receiveAttack.isHit returns True if ship was present on coordinate', () => {
            expect(gameBoard.receiveAttack('A1').isHit).toBe(true);
            expect(gameBoard.receiveAttack('E8').isHit).toBe(true);
            expect(gameBoard.receiveAttack('J7').isHit).toBe(true);
        });

        test.each([
            'A1', 'J10', 'I10', 'J6', 'A3'
        ])('receiveAttack.isSunk returns False when a ship is present on coordinate, but not sunk', (coord) =>{
            const attackResult = gameBoard.receiveAttack(coord);
            expect(attackResult.isHit).toBe(true);
            expect(attackResult.isSunk).toBe(false);
        });

        test.each([
            { coordsArray: ['A1', 'A2'] },
            { coordsArray: ['J10', 'I10', 'H10'] },
            { coordsArray: ['J6', 'J7', 'J8'] },
            { coordsArray: ['A3', 'A4', 'A5', 'A6'] },
            { coordsArray: ['C8', 'D8', 'E8', 'F8', 'G8'] },
        ])('receiveAttack.isSunk returns True when a ship is sunk', ({coordsArray}) => {
            for (let i = 0; i < coordsArray.length - 1; ++i) {
                gameBoard.receiveAttack(coordsArray[i]);
            }
            expect(gameBoard.receiveAttack(coordsArray.at(-1)).isSunk).toBe(true);
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