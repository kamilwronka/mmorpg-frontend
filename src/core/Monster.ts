import { Game } from "phaser";
import { GameScene } from "../App";

export class Monster {
  static readonly SCALE_FACTOR = 1;

  constructor(
    private scene: Phaser.Scene,
    private sprite: Phaser.GameObjects.Sprite,
    startTilePosX: number,
    startTilePosY: number
  ) {
    this.sprite.setInteractive();
    this.sprite.scale = Monster.SCALE_FACTOR;
    this.sprite.setPosition(
      startTilePosX * GameScene.TILE_SIZE + this.getMonsterOffsetX(),
      startTilePosY * GameScene.TILE_SIZE + this.getMonsterOffsetY()
    );
    let tooltip: any;
    let tooltipText: any;
    this.sprite.on("pointerover", (event: any) => {
      console.log(event);

      tooltip = this.scene.add.graphics();

      tooltip.fillStyle(0x222222, 1);
      tooltip.fillRect(
        startTilePosX * GameScene.TILE_SIZE - this.getMonsterTooltipOffsetX(),
        startTilePosY * GameScene.TILE_SIZE - this.getMonsterTooltipOffsetY(),
        120,
        50
      );
      tooltip.setDepth(4);

      tooltipText = this.scene.add.text(
        startTilePosX * GameScene.TILE_SIZE -
          this.getMonsterTooltipOffsetX() +
          4,
        startTilePosY * GameScene.TILE_SIZE -
          this.getMonsterTooltipOffsetY() +
          4,
        "Spider",
        { fontSize: "12", align: "center" }
      );
      tooltipText.setDepth(5);
    });
    this.sprite.on("pointerout", function () {
      tooltip && tooltip.destroy();
      tooltipText && tooltipText.destroy();
    });
  }

  private getMonsterOffsetX(): number {
    return GameScene.TILE_SIZE / 2;
  }

  private getMonsterOffsetY(): number {
    return GameScene.TILE_SIZE / 2;
  }

  private getMonsterTooltipOffsetY(): number {
    return 46 / 2 + 46;
  }

  private getMonsterTooltipOffsetX(): number {
    return 70 / 2;
  }
}
