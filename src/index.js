import { waitForIntroClick } from "./modules/dom/eventListeners";
import { initializeGridResizeObserver } from "./modules/dom/gameSprites";
import {
  initializeGame,
  initializeGameButtons,
} from "./modules/gameLogic/initializeGame";
import "./styles/styles.css";

async function start() {
  await waitForIntroClick();
  const game = initializeGame();
  initializeGameButtons(game);
  initializeGridResizeObserver(game);
}

start();
