import { Gameboard } from "../modules/classes/gameboard";
import { Player } from "../modules/classes/player";

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
});