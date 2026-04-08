import { initializeGame, initializeGameButtons } from "./modules/gameLogic/initializeGame";
import "./styles/styles.css";

function start() {
    const game = initializeGame();
    initializeGameButtons(game);
}

start();