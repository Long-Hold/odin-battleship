import { Computer } from "../modules/classes/player";

describe('class Computer extends Player', () => {
    let computer = null;
    beforeEach(() => {
        computer = new Computer();
    });

    describe('Computer.getRandomAttack()', () => {
        test('returns a coordinate that has not been guessed already', () => {
            const unusedCoordinates = ['A1', 'J10', 'E6', 'F3'];
            
            // Add all coordinates except those in unusedCoordinates
            for (let letter = 'A'.charCodeAt(); letter <= 'J'.charCodeAt(); ++letter) {
                for (let num = 1; num <= 10; ++num) {
                    const coord = `${String.fromCharCode(letter)}${num}`;

                    // Do not add these coordinates as guessed spaces
                    if (unusedCoordinates.includes(coord))
                        continue;

                    computer.gameBoard.recordPlacedAttack(coord);
                }
            }

            while (unusedCoordinates.length > 0) {
                const randomCoord = computer.getRandomAttack();
                expect(unusedCoordinates.includes(randomCoord)).toBe(true);

                // Record this attack and then remove it from the array
                computer.gameBoard.recordPlacedAttack(randomCoord);
                unusedCoordinates.splice(unusedCoordinates.indexOf(randomCoord));
            }

            // Make sure all those coordinates were retrieved by the method
            expect(unusedCoordinates.length).toBe(0);
        });
    });
});