export class Ship {
    static TYPES = new Map([
        ['carrier', 5],
        ['battleship', 4],
        ['destroyer', 3],
        ['submarine', 3],
        ['patrolboat', 2],
    ]);

    #type;
    #length;
    #hitCounter;

    constructor(type) {
        this.type = type;
        this.#length = Ship.TYPES.get(this.#type);
        this.#hitCounter = 0;
    }

    set type(type) {
        if (this.#type) throw new Error('Cannot re-assign Ship type.');

        const trimmedType = type.toLowerCase().trim();
        if (!Ship.TYPES.has(trimmedType)) throw new Error(`${trimmedType} is not a valid ship type.`);

        this.#type = trimmedType;
    }
    get type() {
        return this.#type;
    }

    get length() {
        return this.#length;
    }
    
    get hitCounter() {
        return this.#hitCounter;
    }

    /**
     * Increments the hitCounter property.
     * If hitCounter exceeds the length of the ship, then it is assigned the value of the
     * ships length.
     * 
     * @returns {this} An instance of the object for chaining with other methods.
     */
    hit() {
        if (this.#hitCounter >= this.#length) this.#hitCounter = this.#length;
        else this.#hitCounter += 1;
        return this;
    }

    /**
     * Indicates if the ship has been sunk by comparing the hitCounter to the length.
     * If they are equal, returns true indicating the ship has been sunk,
     * otherwise returns false.
     * 
     * @returns {boolean} True if ship is sunk. False is not.
     */
    isSunk() {
        return this.#hitCounter === this.#length;
    }
}