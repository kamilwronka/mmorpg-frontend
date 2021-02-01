import React from "react";
import * as Phaser from "phaser";
import PathFinder from "pathfinding";

import tileset from "./assets/gliniana-pieczara-3.png";
import ithan from "./assets/cave.json";

import "./App.css";
import { Player } from "./core/Player";
import { GridPhysics } from "./core/GridPhysics";
import { GridControls } from "./core/GridControls";
import LeftBar from "./hud/leftBar/LeftBar";
import RightBar from "./hud/rightBar/RightBar";
import TopBar from "./hud/topBar/TopBar";
import BottomBar from "./hud/bottomBar/BottomBar";
import { createMapMatrix } from "./core/utils/findPath";
import { Monster } from "./core/Monster";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  static readonly CANVAS_WIDTH = window.innerWidth;
  static readonly CANVAS_HEIGHT = window.innerHeight;

  static readonly TILE_SIZE = 32;

  private gridControls: any;
  private gridPhysics: any;
  private player: any;

  constructor() {
    super(sceneConfig);
  }

  public create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("cave-tileset", "tiles");

    const baseLayer = cloudCityTilemap.createLayer(0, "cave-tileset", 0, 0);
    const groundLayer = cloudCityTilemap.createLayer(1, "cave-tileset", 0, 0);

    baseLayer.setDepth(0);
    baseLayer.scale = 1;
    groundLayer.setDepth(1);
    groundLayer.scale = 1;

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(3);

    this.cameras.main.startFollow(playerSprite);

    this.player = new Player(playerSprite, 5, 18);
    this.gridPhysics = new GridPhysics(this.player, cloudCityTilemap);
    this.gridControls = new GridControls(
      this.input,
      this.gridPhysics,
      this.player
    );

    const spiderSprite = this.add.sprite(0, 0, "spider");
    spiderSprite.setDepth(3);

    const spider = new Monster(this, spiderSprite, 5, 22);

    const matrix = createMapMatrix(groundLayer);
    const finder = new PathFinder.AStarFinder();

    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        const { worldX, worldY } = pointer;

        const startVec = groundLayer.worldToTileXY(
          playerSprite.x,
          playerSprite.y
        );
        const targetVec = groundLayer.worldToTileXY(worldX, worldY);

        const grid = new PathFinder.Grid(matrix);

        const path = finder
          .findPath(startVec.x, startVec.y, targetVec.x, targetVec.y, grid)
          .slice(1);

        const vectorPath = path.map(
          ([x, y]: number[]): Phaser.Math.Vector2 => {
            const pos = groundLayer.tileToWorldXY(x, y);
            pos.x += groundLayer.tilemap.tileWidth * 0.5;
            pos.y += groundLayer.tilemap.tileHeight * 0.5;
            return pos;
          }
        );

        const cross = this.add.sprite(
          targetVec.x * 32 + 16,
          targetVec.y * 32 + 24,
          "walk-mark"
        );
        cross.setDepth(2);
        cross.setDisplaySize(32, 32);

        this.time.delayedCall(3000, () => cross.destroy());

        this.gridControls.moveAlong(vectorPath);
      }
    );

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_UP);
    });
  }

  public update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }

  public preload() {
    this.load.image("tiles", tileset);
    this.load.tilemapTiledJSON("cloud-city-map", ithan);
    this.load.spritesheet(
      "player",
      "https://mmorpg-frontend.s3.eu-central-1.amazonaws.com/spritesheet.png",
      {
        frameWidth: Player.SPRITE_FRAME_WIDTH,
        frameHeight: Player.SPRITE_FRAME_HEIGHT,
      }
    );
    this.load.spritesheet(
      "walk-mark",
      "https://mmorpg-frontend.s3.eu-central-1.amazonaws.com/cross.png",
      { frameWidth: 630, frameHeight: 630 }
    );
    this.load.spritesheet(
      "spider",
      "https://mmorpg-frontend.s3.eu-central-1.amazonaws.com/pajak.gif",
      { frameHeight: 46, frameWidth: 70 }
    );

    const progressBar = this.add.graphics({
      x: this.game.canvas.width / 2 - 175,
      y: this.game.canvas.height / 2 - 25,
    });
    const progressBox = this.add.graphics({
      x: this.game.canvas.width / 2 - 175,
      y: this.game.canvas.height / 2 - 25,
    });

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(0, 30, 350, 50);

    this.load.on("progress", function (value: any) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(10, 40, 300 * value, 30);
    });

    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
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
  backgroundColor: "#392553",
};

export const game = new Phaser.Game(gameConfig);

function App() {
  return (
    <div className="main-container">
      <TopBar />
      <LeftBar />
      <div className="game-container">
        <div id="game"></div>
      </div>
      <RightBar />
      <BottomBar />
    </div>
  );
}

export default App;
