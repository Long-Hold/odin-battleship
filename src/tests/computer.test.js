import { Computer } from "../modules/classes/player";

describe("class Computer extends Player", () => {
  let computer = null;
  beforeEach(() => {
    computer = new Computer();
  });

  describe("Computer.getAttack()", () => {
    test("returns a coordinate that has not been guessed already", () => {
      const unusedCoordinates = ["A1", "J10", "E6", "F3"];

      // Add all coordinates except those in unusedCoordinates
      for (
        let letter = "A".charCodeAt();
        letter <= "J".charCodeAt();
        ++letter
      ) {
        for (let num = 1; num <= 10; ++num) {
          const coord = `${String.fromCharCode(letter)}${num}`;

          // Do not add these coordinates as guessed spaces
          if (unusedCoordinates.includes(coord)) continue;

          computer.gameBoard.recordPlacedAttack(coord);
        }
      }

      while (unusedCoordinates.length > 0) {
        const randomCoord = computer.getAttack();
        expect(unusedCoordinates.includes(randomCoord)).toBe(true);

        // Record this attack and then remove it from the array
        computer.gameBoard.recordPlacedAttack(randomCoord);
        unusedCoordinates.splice(unusedCoordinates.indexOf(randomCoord), 1);
      }

      // Make sure all those coordinates were retrieved by the method
      expect(unusedCoordinates.length).toBe(0);
    });
  });
  describe("Computer.getAdjacentAttacks()", () => {
    test("throws Error if passed an unguessed coordinate", () => {
      expect(() => computer.queueAdjacentAttacks("A1")).toThrow(Error);
      expect(() => computer.queueAdjacentAttacks("j10")).toThrow(Error);
      expect(() => computer.queueAdjacentAttacks("B6")).toThrow(Error);
    });
    test("queues 4 adjacent attacks from the reference coordinate", () => {
      const adjacentCoordinates = ["B1", "C2", "B3", "A2"];
      const referenceCoordinate = "B2";

      computer.gameBoard.recordPlacedAttack(referenceCoordinate);
      computer.queueAdjacentAttacks(referenceCoordinate);
      for (let i = 0; i < 4; ++i) {
        const result = computer.getAttack();
        expect(adjacentCoordinates.includes(result)).toBe(true);
      }
    });
    test.each([
      {
        attacks: ["B2", "B3"],
        reference: "B2",
        toIgnore: "B3",
        queue: ["B1", "C2", "A2"],
      },
      { attacks: ["A1", "A2"], reference: "A1", toIgnore: "A2", queue: ["B1"] },
      {
        attacks: ["A10", "B10"],
        reference: "A10",
        toIgnore: "B10",
        queue: ["A9"],
      },
      { attacks: ["J1", "I1"], reference: "J1", toIgnore: "I1", queue: ["J2"] },
      {
        attacks: ["J10", "J9"],
        reference: "J10",
        toIgnore: "J9",
        queue: ["I10"],
      },
      {
        attacks: ["A5", "A6"],
        reference: "A5",
        toIgnore: "A6",
        queue: ["A4", "B5"],
      },
      {
        attacks: ["J5", "J4"],
        reference: "J5",
        toIgnore: "J4",
        queue: ["J6", "I5"],
      },
      {
        attacks: ["E1", "D1"],
        reference: "E1",
        toIgnore: "D1",
        queue: ["F1", "E2"],
      },
      {
        attacks: ["E10", "F10"],
        reference: "E10",
        toIgnore: "F10",
        queue: ["D10", "E9"],
      },
      {
        attacks: ["E5", "E4", "E6", "D5"],
        reference: "E5",
        toIgnore: "E4",
        queue: ["F5"],
      },
    ])(
      "filters out guessed attack: $toIgnore from queue",
      ({ attacks, reference, toIgnore, queue }) => {
        for (let i = 0; i < attacks.length; ++i)
          computer.gameBoard.recordPlacedAttack(attacks[i]);

        computer.queueAdjacentAttacks(reference);
        for (let i = 0; i < queue.length; ++i) {
          const result = computer.getAttack();
          expect(result).not.toBe(toIgnore);
          expect(queue.includes(result)).toBe(true);
          computer.gameBoard.recordPlacedAttack(result);
        }

        // Should be a random coordinate
        const result = computer.getAttack();
        expect(queue.includes(result)).toBe(false);
      },
    );
    describe("when lockedDirection is set (first conditional)", () => {
      test.each([
        { initial: "B2", secondary: "B3", tertiary: "B4", expectedCoord: "B5" },
        { initial: "B4", secondary: "B3", tertiary: "B2", expectedCoord: "B1" },
        { initial: "C5", secondary: "D5", tertiary: "E5", expectedCoord: "F5" },
        { initial: "E5", secondary: "D5", tertiary: "C5", expectedCoord: "B5" },
      ])(
        "queues next sibling $expectedCoord after hits on $initial, $secondary, $tertiary",
        ({ initial, secondary, tertiary, expectedCoord }) => {
          computer.gameBoard.recordPlacedAttack(initial);
          computer.queueAdjacentAttacks(initial);

          computer.gameBoard.recordPlacedAttack(secondary);
          computer.queueAdjacentAttacks(secondary);

          computer.gameBoard.recordPlacedAttack(tertiary);
          computer.queueAdjacentAttacks(tertiary);

          expect(computer.getAttack()).toBe(expectedCoord);
        },
      );

      test("reverses direction when next sibling is out of bounds", () => {
        // ASCENDING along LETTER axis hits the border at B10, should reverse to B7
        computer.gameBoard.recordPlacedAttack("B8");
        computer.queueAdjacentAttacks("B8");

        computer.gameBoard.recordPlacedAttack("B9");
        computer.queueAdjacentAttacks("B9");

        computer.gameBoard.recordPlacedAttack("B10");
        computer.queueAdjacentAttacks("B10");

        expect(computer.getAttack()).toBe("B7");
      });
    });
  });
  describe("Computer.handleMissedAttack()", () => {
    describe("does not mutate Computer.#targeting object", () => {
      test("if there is no lockedDirection, but there is an initialStrike", () => {
        const referenceCoord = "B2";
        const expectedQueue = ["A2", "B1", "C2", "B3"];
        const retrievedAttacks = [];

        computer.gameBoard.recordPlacedAttack(referenceCoord);
        computer.queueAdjacentAttacks(referenceCoord);

        // This should have no effect on the expected returned coordinates
        computer.handleMissedAttack();

        for (let i = 0; i < expectedQueue.length; ++i) {
          const retrievedCoord = computer.getAttack();
          retrievedAttacks.push(retrievedCoord);
          computer.gameBoard.recordPlacedAttack(retrievedCoord);
        }

        expectedQueue.sort();
        retrievedAttacks.sort();

        /**
         * Because there is only an initial strike and no locked direction,
         * the #targeting property should not be modified in anyway, most notably
         * clearing the queue to reverse the direction prematurely.
         *
         * So the two arrays should match in values
         */
        expect(
          retrievedAttacks.every((coord) => expectedQueue.includes(coord)),
        ).toBe(true);
      });
    });
    describe("reverses lockedDirection and queues sibling of initialStrike", () => {
      test.each([
        {
          initial: "B2",
          secondary: "B3",
          initialDirection: "ASCENDING",
          reversedDirection: "DESCENDING",
          expectedCoord: "B1",
        },
        {
          initial: "B3",
          secondary: "B2",
          initialDirection: "DESCENDING",
          reversedDirection: "ASCENDING",
          expectedCoord: "B4",
        },
        {
          initial: "C5",
          secondary: "D5",
          initialDirection: "ASCENDING",
          reversedDirection: "DESCENDING",
          expectedCoord: "B5",
        },
        {
          initial: "D5",
          secondary: "C5",
          initialDirection: "DESCENDING",
          reversedDirection: "ASCENDING",
          expectedCoord: "E5",
        },
      ])(
        "$initialDirection → $reversedDirection: queues $expectedCoord from $initial",
        ({ initial, secondary, expectedCoord }) => {
          computer.gameBoard.recordPlacedAttack(initial);
          computer.queueAdjacentAttacks(initial);

          computer.gameBoard.recordPlacedAttack(secondary);
          computer.queueAdjacentAttacks(secondary);

          computer.handleMissedAttack();

          expect(computer.getAttack()).toBe(expectedCoord);
        },
      );
      test("does not enqueue when reversal from initialStrike is out of bounds", () => {
        // A1 → A2 is ASCENDING; reversed DESCENDING from A1 is out of bounds
        computer.gameBoard.recordPlacedAttack("A1");
        computer.queueAdjacentAttacks("A1");

        computer.gameBoard.recordPlacedAttack("A2");
        computer.queueAdjacentAttacks("A2");

        computer.handleMissedAttack();

        // Queue should be empty — getAttack() falls back to random, so just verify it doesn't throw
        // and doesn't return either of the already-guessed coordinates
        const result = computer.getAttack();
        expect(result).not.toBe("A1");
        expect(result).not.toBe("A2");
      });
    });
  });
});
