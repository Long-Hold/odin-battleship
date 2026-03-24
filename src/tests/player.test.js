import { Gameboard } from "../modules/classes/gameboard";
import { Player } from "../modules/classes/player";
import { Ship } from "../modules/classes/ship";

describe('class Player', () => {
    let player;
    beforeEach(() => {
        player = new Player();
    });
    
    describe('constructor', () => {
        test('Player object owns an instance of a Gameboard object', () => {
            expect(player.gameBoard).toBeInstanceOf(Gameboard);
        });
    });

    describe('Player.randomizeShipPlacements()', () => {
        test('Player.gameBoard.placeShip() throws an error when trying to place duplicates after method finishes', () => {
            player.randomizeShipPlacements();
            for (const [ship, length] of Ship.TYPES) {
                const coords = [];
                for (let i = 1; i <= length; ++i)
                    coords.push(`A${i}`);
                expect(() => player.gameBoard.placeShip(coords, ship)).toThrow(Error);
            }
        });
    });
});