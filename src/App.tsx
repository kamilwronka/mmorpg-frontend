import React from "react";
import * as Phaser from "phaser";

// import map from "./assets/cloud-map.json";
import tileset from "./assets/cloud_tileset.png";
import playersCharacters from "./assets/characters.png";
import ithan from "./assets/ithan.json";

import "./App.css";
import { Player } from "./core/Player";
import { GridPhysics } from "./core/GridPhysics";
import { GridControls } from "./core/GridControls";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  static readonly CANVAS_WIDTH = window.innerWidth;
  static readonly CANVAS_HEIGHT = window.innerHeight;

  static readonly TILE_SIZE = 48;

  private gridControls: any;
  private gridPhysics: any;

  constructor() {
    super(sceneConfig);
  }

  public create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("cloud-tileset", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "cloud-tileset", 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);

    this.cameras.main.startFollow(playerSprite);

    this.gridPhysics = new GridPhysics(
      new Player(playerSprite, 6, 8, 8),
      cloudCityTilemap
    );
    this.gridControls = new GridControls(this.input, this.gridPhysics);
  }

  public update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }

  public preload() {
    this.load.image("tiles", tileset);
    this.load.tilemapTiledJSON("cloud-city-map", ithan);
    this.load.spritesheet("player", playersCharacters, {
      frameWidth: Player.SPRITE_FRAME_WIDTH,
      frameHeight: Player.SPRITE_FRAME_HEIGHT,
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: GameScene,
  scale: {
    mode: Phaser.Scale.RESIZE,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  parent: "game",
  backgroundColor: "#48C4F8",
};

export const game = new Phaser.Game(gameConfig);

function App() {
  return (
    <div className="main-container">
      <div className="game-container">
        <div id="game"></div>
      </div>
    </div>
  );
}

export default App;
