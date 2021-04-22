import { TILE_SIZE } from "../constants/map";
import { Character } from "./Character";

export interface LoadMonsterSpriteRequest {
  name: string;
  spriteUrl: string;
}

export interface MonsterOptions {
  spriteUrl: string;
  x?: number;
  y?: number;
}

export class Monster extends Phaser.GameObjects.Sprite {
  static readonly SCALE_FACTOR = 1;
  static readonly DEFAULT_DEPTH = 3;

  monsterOptions: MonsterOptions;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    options: MonsterOptions
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.monsterOptions = options;

    this.scene.add.existing(this);

    this.loadMonsterSprite({ spriteUrl: options.spriteUrl, name: texture });

    this.setDepth(Monster.DEFAULT_DEPTH);

    this.scale = Monster.SCALE_FACTOR;
    this.setPosition(
      x * TILE_SIZE + this.monsterOffsetX(),
      y * TILE_SIZE + this.monsterOffsetY()
    );
  }

  loadMonsterSprite({ name, spriteUrl }: LoadMonsterSpriteRequest): void {
    this.scene.load.on(Phaser.Loader.Events.START, () => {
      this.scene.load.image(name, spriteUrl);

      this.scene.load.removeListener(Phaser.Loader.Events.START);
    });

    this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.setTexture(name);

      this.scene.load.removeListener(Phaser.Loader.Events.COMPLETE);
    });
  }

  monsterOffsetX(): number {
    return TILE_SIZE / 2;
  }

  monsterOffsetY(): number {
    return (
      -((Character.SPRITE_FRAME_HEIGHT * Character.SCALE_FACTOR) % TILE_SIZE) /
      2
    );
  }

  // constructor(
  //   private scene: Phaser.Scene,
  //   startTilePosX: number,
  //   startTilePosY: number,
  //   private sprite: Phaser.GameObjects.Sprite,
  // ) {

  //   this.sprite.setInteractive();
  //   this.sprite.scale = Monster.SCALE_FACTOR;
  //   this.sprite.setPosition(
  //     startTilePosX * TILE_SIZE + this.getMonsterOffsetX(),
  //     startTilePosY * TILE_SIZE + this.getMonsterOffsetY()
  //   );
  //   let tooltip: any;
  //   let tooltipText: any;
  //   this.sprite.on("pointerover", (event: any) => {
  //     console.log(event);

  //     tooltip = this.scene.add.graphics();

  //     tooltip.fillStyle(0x222222, 1);
  //     tooltip.fillRect(
  //       startTilePosX * TILE_SIZE - this.getMonsterTooltipOffsetX(),
  //       startTilePosY * TILE_SIZE - this.getMonsterTooltipOffsetY(),
  //       120,
  //       50
  //     );
  //     tooltip.setDepth(4);

  //     tooltipText = this.scene.add.text(
  //       startTilePosX * TILE_SIZE - this.getMonsterTooltipOffsetX() + 4,
  //       startTilePosY * TILE_SIZE - this.getMonsterTooltipOffsetY() + 4,
  //       "Spider",
  //       { fontSize: "12", align: "center" }
  //     );
  //     tooltipText.setDepth(5);
  //   });
  //   this.sprite.on("pointerout", function () {
  //     tooltip && tooltip.destroy();
  //     tooltipText && tooltipText.destroy();
  //   });
  // }
  private getMonsterTooltipOffsetY(): number {
    return 46 / 2 + 46;
  }

  private getMonsterTooltipOffsetX(): number {
    return 70 / 2;
  }
}
