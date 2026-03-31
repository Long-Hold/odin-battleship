import { assignGameGridIDs, createGameGrid, displayShips, GRID_IDS } from "./modules/dom/gameGrid";
import { Player, Computer } from "./modules/classes/player";
import { Game } from "./modules/classes/gameInstance"
import "./styles/styles.css";

function initializeGame() {
    const playerOne = new Player();
    const playerTwo = new Computer();

    playerOne.randomizeShipPlacements();
    playerTwo.randomizeShipPlacements();

    createGameGrid();
    assignGameGridIDs();

    const game = new Game(
        playerOne, document.querySelector(`#${GRID_IDS.PLAYER_ONE}`), 
        playerTwo, document.querySelector(`#${GRID_IDS.COMPUTER}`)
    );
    displayShips(game.playerOne.board, playerOne.gameBoard.shipPlacements);
    displayShips(game.playerTwo.board, playerTwo.gameBoard.shipPlacements);
}

initializeGame();