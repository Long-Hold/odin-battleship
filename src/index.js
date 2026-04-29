import { waitForIntroClick } from "./modules/dom/eventListeners";
import { initializeGame, initializeGameButtons } from "./modules/gameLogic/initializeGame";
import "./styles/styles.css";

async function start() {
    // await waitForIntroClick();
    const game = initializeGame();
    initializeGameButtons(game);
}

start();