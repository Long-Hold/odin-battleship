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
    });
});