/**
 * Randomizes the ship placements for each Player object, passed via the Game instance.
 * 
 * After the internal state for ships has been randomized, those changes are then rendered
 * to the dom via renderFunction.
 * 
 * @param {Object} game - A Game object instance that stores Player and DOM Board references.
 * @param {Function} renderFunction - A function that can render changes to the DOM.
 */
export function randomizeShips(game, renderFunction) {
    const playerOne = game.playerOne.player;
    const playerOneBoard = game.playerOne.board;

    const playerTwo = game.playerTwo.player;
    const playerTwoBoard = game.playerTwo.board;

    playerOne.randomizeShipPlacements();
    playerTwo.randomizeShipPlacements();

    renderFunction(
        playerOneBoard,
        [...playerOne.gameBoard.shipPlacements.keys()]
    );

    renderFunction(
        playerTwoBoard,
        [...playerTwo.gameBoard.shipPlacements.keys()]
    );
}