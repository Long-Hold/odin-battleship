import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

export class Player {
    constructor() {
        this.gameBoard = new Gameboard();
    }

    /**
     * Places each ship onto a random range of coordinates.
     * 
     * @returns {this} An instance of the object for chaining.
     */
    randomizeShipPlacements() {
        /**
         * The while loop increments a random axis from a randomly generated
         * coordinated. There are no bounds checking during this so it can make
         * and invalid range.
         * 
         * In that case, it just recalculates. This is a brute force approach, but
         * the size of the grid means this won't happen too often.
         */

        this.gameBoard.reset();
        for (const [ship, length] of Ship.TYPES) {
            while (true) {
                const coordinate = Gameboard.getRandomCoordinate();

                const letter = coordinate[0];
                const number = parseInt(coordinate.slice(1));

                const randomAxis = Math.random() > 0.5 ? number : letter;
                const coordRange = [];

                if (Number.isInteger(randomAxis))
                    for (let i = 0; i < length; ++i)
                        coordRange.push(`${letter}${randomAxis + i}`);
                else {
                    const charCode = letter.charCodeAt();
                    for (let i = 0; i < length; ++i)
                        coordRange.push(`${String.fromCharCode(charCode + i)}${number}`);
                }

                try {
                    this.gameBoard.placeShip(coordRange, ship);
                    this.gameBoard.recordShipAxis(ship, randomAxis);
                    break;
                } catch {
                    // Swallow errors and recalculate
                }
            }
        }

        return this;
    }
}

export class Computer extends Player {
    /**
     * An array that serves the role of a Queue data structure.
     * 
     * It's purpose is to store valid coordinates adjacent to a coordinate that was
     * marked as a hit. 
     * 
     * These coordinates get popped off the stack and returned as the CPU's move during it's turn.
     */
    #coordQueue;

    constructor() {
        super();
        this.#coordQueue = [];
    }

    /**
     * Returns a random, un-played coordinate from the Gameboard.
     * 
     * This method can be used to get a guess from a Computer player when it's
     * the computer's turn to make an automated move.
     * 
     * @returns {string} A randomly chosen, valid coordinate from the Gameboard.
     */
    getRandomAttack() {
        while (true) {
            const coordinate = Gameboard.getRandomCoordinate();

            // Prevent returning an already guessed coordinate
            if (this.gameBoard.guessedSpaces.has(coordinate))
                continue;

            else return coordinate;
        }
    }

    /**
     * Returns a coordinate string from the Gameboard.
     * 
     * This method is used to retrieve an automated move from the Computer player.
     * 
     * @returns {string} A coordinate from the Gameboard
     */
    getAttack() {
        /**
         * If the coordinate queue is empty, then we aren't trying to sink a ship this turn.
         * The CPU will instead attack a random square anytime this method is called until a hit is landed.
         */
        if (this.#coordQueue.length === 0)
            return this.getRandomAttack();

        return this.#coordQueue.shift();
    }

    //TODO: calculateAdjacentMoves() method to smart target ships
}