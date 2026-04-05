import { Ship } from "./ship";

export class Gameboard {
    /**
     * A map that represents the boundaries of the game grid.
     * 
     * This can be used by DOM methods or verification methods to help generate gameboards
     * or verify something is within bounds of the game while allowing this
     * class to maintain control of game logic.
     */
    static BOUNDS = { 
        COL: { START: 'A'.charCodeAt(), END: 'J'.charCodeAt() }, 
        ROW: { START: 1, END: 10 }
    }

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
     * Generates a random, inclusive coordinate within the Gameboard bounds.
     * 
     * @returns {string} A randomly generated, inclusive coordinate.
     */
    static getRandomCoordinate() {
        const randomChar = String.fromCharCode(
            Math.floor(
                Math.random() * (
                    Gameboard.BOUNDS.COL.END 
                    - Gameboard.BOUNDS.COL.START + 1
                ) 
                    + Gameboard.BOUNDS.COL.START
            )
        );

        const randomNum = Math.floor(
            Math.random() * (
                Gameboard.BOUNDS.ROW.END 
                - Gameboard.BOUNDS.ROW.START + 1
            ) 
                + Gameboard.BOUNDS.ROW.START
        );

        return `${randomChar}${randomNum}`;
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
     * Stores references to created ship objects by using their string name as the key.
     * This Map() allows checking to prevent duplicate ship placement, and for retrieving a
     * ship object if any Ship methods need to be called.
     */
    #placedShips;

    /**
     * A set that stores the players guessed spaces against the other players board.
     * The set structure prevents the player from making multiple guesses on the same space.
     */
    #guessedSpaces;

    constructor() {
        this.#shipPlacements = new Map();
        this.#placedShips = new Map();
        this.#guessedSpaces = new Set();
    }

    get shipPlacements() {
        return this.#shipPlacements;
    }

    get guessedSpaces() {
        return this.#guessedSpaces;
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

        this.#placedShips.set(ship.type, ship);

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

    /**
     * Records guessed coordinates made against an opposing players Gameboard. Players
     * know what attacks they have made.
     * 
     * Placed attacks are recorded in a set to prevent duplicate placements.
     * 
     * @param {string} coordinate - The coordinate guessed on the opposition's board. 
     * @returns {this} The Gameboard instance for chaining.
     */
    recordPlacedAttack(coordinate) {
        if (Gameboard.isOutOfBounds(coordinate))
            throw new RangeError(`${coordinate} is out-of-bounds of the grid`);

        const normCoord = coordinate.toUpperCase().trim();

        if (this.#guessedSpaces.has(normCoord))
            throw new Error(`${coordinate} has already been played`);

        this.#guessedSpaces.add(normCoord);
        return this;
    }

    /**
     * Checks the value of Ship.isSunk() method on each ship in the gameboard.
     * If isSunk() returns true for each ship, then this method returns True to signify
     * that.
     * 
     * @returns {boolean} True if all ships are sunk. False is not.
     */
    allShipsSunk() {
        return [...this.#placedShips.values()].every((ship) => ship.isSunk() === true);
    }

    /**
     * Resets the class properties by clearing them of any data.
     * 
     * @returns {this} The Gameboard instance for chaining.
     */
    reset() {
        this.#shipPlacements.clear();
        this.#placedShips.clear();
        this.#guessedSpaces.clear();

        return this;
    }
}