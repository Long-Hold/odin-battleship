import { Ship } from "../modules/classes/ship";

describe('class Ship', () => {
    describe('constructor', () => {
        test('throws an Error when an invalid string is passed (not in Ship.TYPES)', () => {
            expect(() => new Ship('tugboat')).toThrow(Error);
            expect(() => new Ship('speedboat')).toThrow(Error);
            expect(() => new Ship('sub')).toThrow(Error);
        });
        test('throws an Error when attempting to re-assign ship type', () => {
            const carrier = new Ship('carrier');
            expect(() => {carrier.type = 'destroyer'}).toThrow(Error);
        });
        test('Ship.length matches the value stored in Ship.TYPES', () => {
            let myShip;
            for (const [ship, shipLength] of Ship.TYPES) {
                myShip = new Ship(ship);
                expect(myShip.length).toBe(shipLength);
            }
        });
    });
    describe('Ship.hit()', () => {
        test('Increments the hit counter each time the method is called.', () => {
            const ship = new Ship('carrier');
            
            expect(ship.hitCounter).toBe(0);
            ship.hit();
            expect(ship.hitCounter).toBe(1);
            ship.hit();
            expect(ship.hitCounter).toBe(2);
            ship.hit();
            expect(ship.hitCounter).toBe(3);
        });
        test('Does not increment hitCounter if hitCounter is the same as ship length', () => {
            const ship = new Ship('destroyer');
            expect(ship.hitCounter).not.toBe(ship.length);

            for (let i = 0; i < ship.length; ++i) ship.hit();
            expect(ship.hitCounter).toBe(ship.length);

            // The hitCounter property should remain the same as the ship.length at this point
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hitCounter).toBe(ship.length);
        });
    });
    describe('Ship.isSunk()', () => {
        test('returns false if hitCount !== length', () => {
            const ship = new Ship('patrolboat');
            expect(ship.isSunk()).toBe(false);

            ship.hit();
            expect(ship.isSunk()).toBe(false);
        });
        test('returns true if hitCount === length', () => {
            const ship = new Ship('submarine');
            expect(ship.isSunk()).toBe(false);

            while (ship.hitCounter < ship.length) ship.hit();
            expect(ship.isSunk()).toBe(true);

            // Still returns true after incrementing beyond length
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });
    });
});