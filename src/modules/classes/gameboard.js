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
     * Provides a standard way to define axis labelling.
     * Can be used to signal the direction an object is facing,
     * or whether an axis is ascending or descending.
     */
    static AXIS = {
        COL: 'LETTER',
        ROW: 'NUMBER',
        ASCENDING: 'ASCENDING',
        DESCENDING: 'DESCENDING'
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
     * Takes reference coordinate and returns an array of adjacent coordinates to that reference coordinate.
     * 
     * @param {string} referenceCoordinate - The coordinate that adjacent coordinates are calculated from
     * @returns {string[]} An array of 0–4 valid, in-bounds adjacent coordinates
     */
    static getAdjacentCoordinates(referenceCoordinate) {
        if (this.isOutOfBounds(referenceCoordinate))
            return [];

        const adjacentCoordinates = [];
        const column = referenceCoordinate[0].toUpperCase().charCodeAt();
        const row = Number(referenceCoordinate.slice(1));


        //Get the adjacent top coordinate
        if (row !== this.BOUNDS.ROW.START)
            adjacentCoordinates.push(`${String.fromCharCode(column)}${row - 1}`);
        // Get the adjacent bottom coordinate
        if (row !== this.BOUNDS.ROW.END)
            adjacentCoordinates.push(`${String.fromCharCode(column)}${row + 1}`);
        // Get the adjacent left coordinate
        if (column !== this.BOUNDS.COL.START)
            adjacentCoordinates.push(`${String.fromCharCode(column - 1)}${row}`);
        // Get the adjacent right coordinate
        if (column !== this.BOUNDS.COL.END)
            adjacentCoordinates.push(`${String.fromCharCode(column + 1)}${row}`);

        return adjacentCoordinates;
    }

    /**
     * Determines the axis a ship is facing on the Gameboard grid by calculating the difference
     * of the Row or Column axis portion of two coordinates.
     * 
     * Coordinate pairs with a difference in the column axis (letter axis) are facing the 
     * row axis (number axis).
     * 
     * Coordinate pairs with a difference in the row axis (number axis) are facing 
     * the column axis (letter axis).
     * 
     * @param {string} startCoordinate - The first coordinate point used to determine direction
     * @param {string} endCoordinate - The second coordinate point used to determine direction
     * @returns {string} The axis that the ship is facing
     */
    static getAxisDirection(startCoordinate, endCoordinate) {
        const startCoord = startCoordinate.toUpperCase().trim();
        const endCoord = endCoordinate.toUpperCase().trim();

        if (startCoord === endCoord)
            throw new Error('A direction cannot be determined if both coordinates are the same');
        if (this.isOutOfBounds(startCoord) || this.isOutOfBounds(endCoord))
            throw new Error('invalid coordinate passed');

        /**
         * The rule for determining an axis direction is that only one axis can be different.
         * 
         * If both the letter and number axis are different between the two coordinates, then
         * the direction is diagonal which is not a valid axis direction for the Gameboard.
         */
        const columnDiff = startCoord[0].charCodeAt() - endCoord[0].charCodeAt();
        const rowDiff = Number(startCoord.slice(1)) - Number(endCoord.slice(1));
        if (columnDiff !== 0 && rowDiff !== 0)
            throw new Error('Axis direction cannot be diagonal');

        /**
         * If there is a difference between the columns, then that means the ship is
         * horizontal, along the same row. The number values would be the same in both coordinates.
         * 
         * If there is a difference between the rows, then the ship is vertical, within
         * the same column. The letter values would be the same in both coordinates.
         */
        if (columnDiff !== 0)
            return this.AXIS.ROW;
        if (rowDiff !== 0)
            return this.AXIS.COL
    }

    /**
     * Finds the sibling coordinate of a reference coordinate based on the indicated
     * axis the reference coordinate is face, and if we should be ascending or descending the axis.
     * 
     * If the coordinate is either a letter or number border coordinate, and siblingDirection would cause
     * the sibling to be 'outside' of the game borders, then the return value is null.
     * 
     * @param {string} referenceCoordinate - The coordinate to find the sibling of
     * @param {string} referenceAxis - The direction the ship of the reference coordinate is facing
     * @param {string} siblingDirection - The direction of the sibling to find relative to the reference coordinate
     * @returns {null | string} The sibling coordinate of referenceCoordinate, or null if the params go beyond the game border.
     */
    static getSiblingCoordinate(referenceCoordinate, referenceAxis, siblingDirection) {
        const referenceCoord = referenceCoordinate.toUpperCase().trim();
        if (this.isOutOfBounds(referenceCoord))
            throw new Error(`${referenceCoordinate} is an invalid coordinate`);

        const axisDirection = referenceAxis.toUpperCase().trim();
        if (axisDirection !== this.AXIS.COL && axisDirection !== this.AXIS.ROW)
            throw new Error(`${referenceAxis} is not a valid axis`);

        const siblingDir = siblingDirection.toUpperCase().trim();
        if (siblingDir !== this.AXIS.ASCENDING && siblingDir !== this.AXIS.DESCENDING)
            throw new Error(`${siblingDirection} is not a valid direction`);

        let siblingCoordinate = null;
        if (axisDirection === this.AXIS.COL) {
            siblingCoordinate = (siblingDir === this.AXIS.ASCENDING) ? 
            `${referenceCoord[0]}${Number(referenceCoord.slice(1)) + 1}` :
            `${referenceCoord[0]}${Number(referenceCoord.slice(1))  - 1}`;
        }
        else if (axisDirection === this.AXIS.ROW) {
            const columnCoord = referenceCoord[0].charCodeAt();
            siblingCoordinate = (siblingDir === this.AXIS.ASCENDING) ?
            `${String.fromCharCode(columnCoord + 1)}${referenceCoord.slice(1)}` :
            `${String.fromCharCode(columnCoord - 1)}${referenceCoord.slice(1)}`;
        }

        return this.isOutOfBounds(siblingCoordinate) ? null : siblingCoordinate;
    }

    /**
     * Finds the direction a pair of coordinates is heading by calculating the differences
     * in their axis points.
     * 
     * A coordinate pair is considered ASCENDING if either or both:
     *  - endCoordinate letter axis is greater than startCoordinate
     *  - endCoordinate number axis is greater than startCoordinate
     * 
     * The inverse applies for DESCENDING pairs.
     * 
     * The returned value is from the Gameboard.AXIS static object.
     * 
     * @param {string} startCoordinate - The starting coordinate for comparison
     * @param {string} endCoordinate - The end coordinate for comparison
     * @returns {string} A static variable that contains a string reflecting the coordinate direction
     */
    static getCoordinateDirection(startCoordinate, endCoordinate) {
        const startCoord = startCoordinate.toUpperCase().trim();
        const endCoord = endCoordinate.toUpperCase().trim();
        if (this.isOutOfBounds(startCoord) || this.isOutOfBounds(endCoord))
            throw new Error(`${this.isOutOfBounds(startCoord) ? startCoord : endCoord} is not a valid coordinate`);
        if (startCoord === endCoord)
            throw new Error('coordinates cannot be the same');

        const startLetter = startCoord[0];
        const startNumber = parseInt(startCoord.slice(1));

        const endLetter = endCoord[0];
        const endNumber = parseInt(endCoord.slice(1));

        if (startLetter !== endLetter)
            return startLetter < endLetter ? this.AXIS.ASCENDING : this.AXIS.DESCENDING;

        return startNumber < endNumber ? this.AXIS.ASCENDING : this.AXIS.DESCENDING;
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

    /**
     * A map that stores the ship object as the key, and the axis direction as the value.
     */
    #shipAxis;

    constructor() {
        this.#shipPlacements = new Map();
        this.#placedShips = new Map();
        this.#guessedSpaces = new Set();
        this.#shipAxis = new Map();
    }

    get shipPlacements() {
        return this.#shipPlacements;
    }

    get guessedSpaces() {
        return this.#guessedSpaces;
    }

    get shipAxis() {
        return this.#shipAxis;
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
     * Links a ship object to the direction it is facing on the board.
     * 
     * @param {string} shipType - The name of the ship
     * @param {number | string} direction - The direction the ship is facing
     * @returns 
     */
    recordShipAxis(shipType, direction) {
        const ship = this.#placedShips.get(shipType);

        if (Number.isInteger(direction))
            this.#shipAxis.set(ship, Gameboard.AXIS.ROW);
        else
            this.shipAxis.set(ship, Gameboard.AXIS.COL);

        return this;
    }

    /**
     * Checks if the opposing players selected coordinate to attack has hit a ship.
     * If a ship has been hit, then the respective Ship.hit() method is called and returns true.
     * 
     * If no ship is hit, return false.
     * 
     * @param {string} coordinate - The coordinate the opposing player attacked.
     * @returns {object} True if a ship was hit. False if no ship was hit.
     */
    receiveAttack(coordinate) {
        if (Gameboard.isOutOfBounds(coordinate))
            throw new RangeError(`${coordinate} is out-of-bounds of the grid`);
        
        const normCoord = coordinate.toUpperCase().trim();
        const ship = this.#shipPlacements.get(normCoord);
        const shipStatus = {
            isHit: null,
            isSunk: null,
        };

        if (!ship) {
            shipStatus.isHit = false;
            shipStatus.isSunk = false;
        }
        else {
            ship.hit();
            shipStatus.isHit = true;
            shipStatus.isSunk = ship.isSunk();
        }

        return shipStatus;
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
        this.#shipAxis.clear();

        return this;
    }

    /**
     * Returns an array of all coordinates occupied by the ship at the given coordinate.
     * If no ship exists at the coordinate, returns null.
     *
     * @param {string} coordinate - Any coordinate the ship occupies.
     * @returns {string[] | null} All coordinates belonging to that ship, or null if no ship is present.
     */
    getShipCoordinates(coordinate) {
        const normCoord = coordinate.toUpperCase().trim();
        const ship = this.#shipPlacements.get(normCoord);
        if (!ship) return null;

        const coords = [];
        for (const [coord, shipRef] of this.#shipPlacements)
            if (shipRef === ship) coords.push(coord);

        return coords;
    }
}