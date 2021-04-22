import * as Phaser from "phaser";

import "../App.css";
import { BasicScene } from "./scenes/BasicScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: BasicScene,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },

  parent: "game",
  backgroundColor: "#392553",
};

export const game = new Phaser.Game(gameConfig);

function Game() {
  return (
    <div className="game-container">
      <div id="game"></div>
    </div>
  );
}

export default Game;
