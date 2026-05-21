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
     * An object that stores data to help the Computer player make an intelligent attack.
     * 
     * Paramters:
     * queue - A series of coordinates adjacent to a coordinate that was hit in the most recent move
     * hitStreak - A recording of coordinates hit in the current streak to help determine ship direction
     * lockedDirection - the direction to caluclate next moves for
     */
    #targeting;

    constructor() {
        super();
        this.#targeting = {
            // The queue of attacks to pick from in the case a hit is registered
            queue: [],
            // The coordinate of the initial strike, serves as a reference for targeting the rest of the ship
            initialStrike: null,
            // The direction to attack in, either ascending or descending in coordinate value
            lockedDirection: null,
            // The axis the enemy ship is facing
            facingAxis: null,
        }
    }

    /**
     * Returns a random, un-played coordinate from the Gameboard.
     * 
     * This method can be used to get a guess from a Computer player when it's
     * the computer's turn to make an automated move.
     * 
     * @returns {string} A randomly chosen, valid coordinate from the Gameboard.
     */
    #getRandomAttack() {
        while (true) {
            const coordinate = Gameboard.getRandomCoordinate();

            // Prevent returning an already guessed coordinate
            if (this.gameBoard.guessedSpaces.has(coordinate))
                continue;

            else return coordinate;
        }
    }

    /**
     * Reverses the #targeting.lockedDirection property and enques the next coordinate
     * from the new direction.
     */
    #reverseAndEnqueue() {
        const oppositeDirection = 
            this.#targeting.lockedDirection === Gameboard.AXIS.ASCENDING ? 
            Gameboard.AXIS.DESCENDING : 
            Gameboard.AXIS.ASCENDING;
        
        this.#targeting.lockedDirection = oppositeDirection;

        this.#targeting.queue.length = 0;
        const nextAttack = Gameboard.getSiblingCoordinate(
            this.#targeting.initialStrike,
            this.#targeting.facingAxis,
            this.#targeting.lockedDirection
        );
        if (nextAttack) this.#targeting.queue.push(nextAttack);
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
        while (this.#targeting.queue.length > 0) {
            // Remove guessed spacess from the queue
            const next = this.#targeting.queue.shift();
            if (!this.gameBoard.guessedSpaces.has(next))
                return next;
        }
        return this.#getRandomAttack();
    }

    queueAdjacentAttacks(referenceCoordinate) {
        const referenceCoord = referenceCoordinate.toUpperCase();

        if (this.gameBoard.guessedSpaces.has(referenceCoord) === false)
            throw new Error(`${referenceCoord} has not been guessed by CPU`);

        /**
         * If CPU already has a locked direction, then I can just enqueue the next coordinate in that direction.
         * If, however, that coordinate is out of bounds or a coordinate that's already been struck, then
         * we can reverse direction.
         */
        if (this.#targeting.lockedDirection) {
            // sanity check that the queue is emptied
            this.#targeting.queue.length = 0;
            const nextAttack = Gameboard.getSiblingCoordinate(
                referenceCoord,
                this.#targeting.facingAxis,
                this.#targeting.lockedDirection
            );
            if (!nextAttack)
                this.#reverseAndEnqueue();
            else
                this.#targeting.queue.push(nextAttack);
        }

        else if (this.#targeting.initialStrike) {
            this.#targeting.queue.length = 0;
            // The axis the ship is FACING
            this.#targeting.facingAxis = Gameboard.getAxisDirection(this.#targeting.initialStrike, referenceCoord);
            // Now I can calculate whether or not this is reference coord is higher or lower than the initial strike
            this.#targeting.lockedDirection = Gameboard.getCoordinateDirection(this.#targeting.initialStrike, referenceCoord);

            // Now that I know whether the second strike was ascending or descending and the axis to increase / decrease
            const nextAttack = Gameboard.getSiblingCoordinate(referenceCoord, this.#targeting.facingAxis, this.#targeting.lockedDirection);
            this.#targeting.queue.push(nextAttack);
        }

        // Otherwise all adjacent coordinates need to be checked until another hit is found or queue is exhausted
        else {
            const adjacentCoordinates = [...Gameboard.getAdjacentCoordinates(referenceCoord)];
            this.#targeting.queue = adjacentCoordinates.filter(coord => this.gameBoard.guessedSpaces.has(coord) === false);
            this.#targeting.initialStrike = referenceCoord;
        }
    }

    /**
     * When the CPU makes a misssed attack, the targeting data is analyzed.
     * If there is a queue, then the attacking direction is reversed from the initial strike to finish the ship off.
     * 
     * If there is no queue, then the targeting data is reset and the CPU will make random attacks until it lands another hit.
     */
    handleMissedAttack() {
        if (!this.#targeting.initialStrike || !this.#targeting.lockedDirection) return;

        this.#reverseAndEnqueue();
    }

    /**
     * Resets and clears the targeting properties used to follow up on
     * confirmed hit moves.
     * 
     * This method is primarily called by the caller when the game no longer wants the CPU
     * to make intelligent attacks and use random attack logic instead.
     * 
     * @returns {this} An instance of the Class for method chaining.
     */
    clearTargetingData() {
        this.#targeting.queue.length = 0;
        this.#targeting.initialStrike = null;
        this.#targeting.lockedDirection = null;
        this.#targeting.facingAxis = null;
        
        return this;
    }
}