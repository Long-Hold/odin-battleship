export async function runGame(game, coordinateRetriever) {
    const playerOne = game.playerOne.player;
    const playerTwo = game.playerTwo.player;

    while (true) {
        console.log('waiting for click...');
        const coord = await coordinateRetriever();
        console.log(coord);

        try {
            game.handleAttack(coord);
        } catch (error) {
            console.log('invalid');
            continue;
        }

        if (playerOne.gameBoard.allShipsSunk() || playerTwo.gameBoard.allShipsSunk()) {
            alert('Game over! Loser:', playerOne.gameBoard.allShipsSunk() ? playerOne : playerTwo);
            break;
        }
    }
}