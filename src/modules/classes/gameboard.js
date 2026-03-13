import { Ship } from "./ship";

export class Gameboard {
    /**
     * Compares the coordinate string against a regex pattern.
     * Coordinates should only ever have 1 letter between and including the letters
     * 'A' to 'J', and the a value between and including '1' to '1o'.
     * 
     * If the string does not pass these requirements, then it returns true to indicate
     * the coordinate is out-of-bounds.
     * 
     * @param {string} coordinate - The string to check for validity
     * @returns {boolean} True if coordinate is invalid. False if it is valid.
     */
    static isOutOfBounds(coordinate) {
        const validCoordRegex = /^[A-Ja-j]([1-9]|10)$/;
        return !validCoordRegex.test(coordinate);
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
     * Stores references to Ship objects.
     * This set exists to prevent duplicate ships being placed in the Gameboard.
     */
    #placedShips;

    /**
     * A set that stores the players guessed spaces against the other players board.
     * The set structure prevents the player from making multiple guesses on the same space.
     */
    #guessedSpaces;

    constructor() {
        this.#shipPlacements = new Map();
        this.#placedShips = new Set();
        this.#guessedSpaces = new Set();
    }

    /**
     * Creates a ship object and links the coordinates it was placed on to that
     * ship object.
     * 
     * @param {string[]} coordinates - An array of coordinates linked to the ship.
     * @param {string} shipType - The type of ship to be created and placed.
     * @returns {this} The Gameboard instance for chaining.
     */
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
        if (this.#placedShips.has(ship.type))
            throw new Error(`${ship.type} has already been placed on the board`);

        if (normalizedCoords.length !== ship.length)
            throw new Error(`coordinates range (${coordinates}) is larger than ship length (${ship.length})`);

        this.#placedShips.add(ship.type);

        for (const coordinate of normalizedCoords)
            this.#shipPlacements.set(coordinate, ship);

        return this;
    }

    /**
     * Checks if the opposing players selected coordinate to attack has hit a ship.
     * If a ship has been hit, then the respective Ship.hit() method is called and returns true.
     * 
     * If no ship is hit, return false.
     * 
     * @param {string} coordinate - The coordinate the opposing player attacked.
     * @returns {boolean} True if a ship was hit. False if no ship was hit.
     */
    receiveAttack(coordinate) {
        if (Gameboard.isOutOfBounds(coordinate))
            throw new RangeError(`${coordinate} is out-of-bounds of the grid`);
        
        const normCoord = coordinate.toUpperCase().trim();
        const ship = this.#shipPlacements.get(normCoord);

        if (!ship) return false;

        ship.hit();
        return true;
    }
}