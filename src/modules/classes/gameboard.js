import { Ship } from "./ship";

export class Gameboard {
    static isOutOfBounds(coordinate) {
        const normalized = coordinate.toUpperCase().trim();
        const char = normalized[0];
        const intPart = parseInt(normalized.slice(1));

        return (char < 'A' || char > 'J') || (intPart < 1 || intPart > 10);
    }
    /**
     * A Map() that stores Key: Values of the coordinate and it's linked ship in a 
     * <string, ship> fashion.
     * 
     * E.G:
     * Map.set('A1', destroyer);
     * Map.set('A2', destroyer);
     * Map.set('A3', destroyer);
     * 
     * So multiple coordinates reference one ship, instead of vice-versa.
     * 
     * I can just check if a key exists during ship placement to prevent overlapping, or
     * get the refernced ship to call hit() on during gameplay.
     */
    #shipPlacements;

    /**
     * A set that stores the players guessed spaces against the other players board.
     * The set structure prevents the player from making multiple guesses on the same space.
     */
    #guessedSpaces;

    constructor() {
        this.#shipPlacements = new Map();
        this.#guessedSpaces = new Set();
    }

    placeShip(coordinates, shipType) {
        if (!Array.isArray(coordinates))
            throw new TypeError('coordinates must be passed as an array');

        /**
         * Normalize coordinates while checking if they are within bounds, and the space
         * is not occupied in the same loop.
         */
        const normalizedCoords = [];
        for (const coordinate of coordinates) {
            const normCoord = coordinate.toUpperCase().trim();

            if (Gameboard.isOutOfBounds(normCoord))
                throw new RangeError(`${normCoord} is out of bounds`);

            if (this.#shipPlacements.has(normCoord))
                throw new Error(`${normCoord} is already occupied by another ship`);
            
            normalizedCoords.push(normCoord);
        }
        
        const ship = new Ship(shipType);
        if (normalizedCoords.length !== ship.length)
            throw new Error(`coordinates range (${coordinates}) is larger than ship length (${ship.length})`);

        for (const coordinate of normalizedCoords)
            this.#shipPlacements.set(coordinate, ship);

        return this;
    }

    /**
     * Receives coordinates as a string and checks the square on the grid.
     * If the square contains a ship, then the ship object hitCounter is updated.
     * 
     * 
     * @param {string} coordinate - The coordinates to check. 
     */
    receiveAttack(coordinate) {
        if (typeof coordinate !== 'string')
            throw new TypeError('coordinate must be passed as a string');

        const trimmedCoords = coordinate.toUpperCase().trim();
        if (!trimmedCoords)
            throw new Error('coordinates cannot be blank or whitespace');

        if (Gameboard.isOutOfBounds(trimmedCoords))
            throw new RangeError(`${trimmedCoords} is out of bounds`);
    }
}