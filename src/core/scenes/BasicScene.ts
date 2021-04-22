import tileset from "../../assets/gliniana-pieczara-3.png";
import ithan from "../../assets/cave.json";

import { GridControls } from "../movement/GridControls";
import { GridPhysics } from "../movement/GridPhysics";
import { Hero } from "../npc/Hero";
import { Monster } from "../npc/Monster";
import { SCENES } from "../constants/scenes";
import { Character } from "../npc/Character";
import { LoadingOverlay } from "../misc/LoadingOverlay";

import monsters from "../../resources/monsters.json";
import { colyseusClient } from "../../App";
import { Room } from "colyseus.js";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: SCENES.GAME_SCENE,
};

export class BasicScene extends Phaser.Scene {
  static readonly CANVAS_WIDTH = window.innerWidth;
  static readonly CANVAS_HEIGHT = window.innerHeight;

  static readonly TILE_SIZE = 32;

  private gridControls: any;
  private gridPhysics: any;
  private player: any;
  private tilemap: any;
  private baseLayer: any;
  private groundLayer: any;

  players: any = {};

  constructor() {
    super(sceneConfig);
  }

  renderTilemap(
    tilemapName: string = "cloud-city-map",
    tilesetName: string = "cave-tileset"
  ) {
    this.tilemap = this.make.tilemap({ key: tilemapName });
    this.tilemap.addTilesetImage(tilesetName, "tiles");

    this.baseLayer = this.tilemap.createLayer(0, tilesetName, 0, 0);
    this.groundLayer = this.tilemap.createLayer(1, tilesetName, 0, 0);

    this.baseLayer.setDepth(0);
    this.baseLayer.scale = 1;
    this.groundLayer.setDepth(1);
    this.groundLayer.scale = 1;
  }

  public create() {
    colyseusClient
      .joinOrCreate("ithan", { id: "wildstylez" })
      .then((room: Room) => {
        room.state.players.onAdd = (player: any, key: string) => {
          console.log(player);

          console.log(player.spriteUrl, player.id);

          this.players["wildstylez"] = new Hero(
            this,
            player.x,
            player.y,
            player.name,
            {
              name: player.name,
              frameWidth: 32,
              frameHeight: 48,
              spriteUrl: player.spriteUrl,
            }
          );

          if ("wildstylez" === player.id) {
            this.cameras.main.startFollow(this.players["wildstylez"]);

            this.gridPhysics = new GridPhysics(
              this.players["wildstylez"],
              this.tilemap
            );
            this.gridControls = new GridControls(
              this,
              this.input,
              this.gridPhysics,
              this.players["wildstylez"],
              this.groundLayer,
              room
            );
          }

          this.load.start();
        };

        room.state.players.onChange = (player: any, key: string) => {
          console.log(player);

          if ("wildstylez" !== player.id) {
            this.players["wildstylez"].setSpritePosition({
              x: player.x * 32 + 16,
              y: player.y * 32 + 24,
            });
          }
        };

        room.state.players.onRemove = (player: any, key: string) => {
          console.log(player);

          if ("wildstylez" !== player.id) {
            this.players["wildstylez"].destroy();
          }
        };

        this.renderTilemap();

        //   this.players = data.players.map((player: any) => {
        //     const playerInstance = new Hero(
        //       this,
        //       player.x + 1,
        //       player.y + 1,
        //       player.name,
        //       {
        //         spriteUrl: player.spriteUrl,
        //         frameWidth: 32,
        //         frameHeight: 48,
        //         name: "player2",
        //       },
        //       room
        //     );

        //     return { player: playerInstance, id: player.id };
        //   });

        //   this.player = new Hero(
        //     this,
        //     5,
        //     20,
        //     data.hero.name,
        //     {
        //       name: data.hero.name,
        //       frameHeight: data.hero.frameHeight,
        //       frameWidth: data.hero.frameWidth,
        //       spriteUrl: data.hero.spriteUrl,
        //     },
        //     room
        //   );

        //   data.monsters.forEach((monster: any) => {
        //     new Monster(this, monster.x, monster.y, monster.name, {
        //       spriteUrl: `https://mmorpg-frontend.s3.eu-central-1.amazonaws.com/${monster.id}.gif`,
        //     });
        //   });

        //   data.players.forEach((player: any) => {
        //     new Hero(
        //       this,
        //       player.x,
        //       player.y,
        //       player.name,
        //       {
        //         spriteUrl: player.spriteUrl,
        //         frameWidth: 32,
        //         frameHeight: 48,
        //         name: "player2",
        //       },
        //       room
        //     );
        //   });

        //   this.cameras.main.startFollow(this.player);

        // triggering it here to avoid running multiple events
        this.load.start();
        // this.cameras.main.fadeIn(1000, 0, 0, 0);
      });
    // });
  }

  public update(_time: number, delta: number) {
    this.gridControls && this.gridControls.update();
    this.gridPhysics && this.gridPhysics.update(delta);
  }

  public preload() {
    this.load.image("tiles", tileset);
    this.load.tilemapTiledJSON("cloud-city-map", ithan);

    this.load.spritesheet(
      "walk-mark",
      "https://mmorpg-frontend.s3.eu-central-1.amazonaws.com/cross.png",
      { frameWidth: 630, frameHeight: 630 }
    );

    new LoadingOverlay(this);
  }
}
