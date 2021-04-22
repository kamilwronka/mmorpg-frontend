import * as PathFinder from "pathfinding";

import { Direction } from "./Direction";
import { GridPhysics } from "./GridPhysics";
import { Hero } from "../npc/Hero";
import { createMapMatrix } from "../utils/findPath";

export class GridControls {
  constructor(
    private scene: Phaser.Scene,
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics,
    private hero: Hero,
    private groundLayer: Phaser.Tilemaps.TilemapLayer,
    private room: any
  ) {
    this.finder = new PathFinder.AStarFinder();
    this.matrix = this.getMapMatrix();

    const currentPosition = hero.getTilePos();
    this.currentX = currentPosition.x;
    this.currentY = currentPosition.y;

    this.setupMouseMoveListener();
  }

  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;
  finder: PathFinder.AStarFinder;
  matrix: any[] = [];
  currentY: number;
  currentX: number;

  setupMouseMoveListener() {
    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        const { worldX, worldY } = pointer;

        const startVector = this.groundLayer.worldToTileXY(
          this.hero.x,
          this.hero.y
        );
        const targetVector = this.groundLayer.worldToTileXY(worldX, worldY);

        const grid = new PathFinder.Grid(this.matrix);

        const path = this.finder
          .findPath(
            startVector.x,
            startVector.y,
            targetVector.x,
            targetVector.y,
            grid
          )
          .slice(1);

        const vectorPath = path.map(
          ([x, y]: number[]): Phaser.Math.Vector2 => {
            const pos = this.groundLayer.tileToWorldXY(x, y);
            pos.x += this.groundLayer.tilemap.tileWidth * 0.5;
            pos.y += this.groundLayer.tilemap.tileHeight * 0.5;
            return pos;
          }
        );

        const cross = this.scene.add.sprite(
          targetVector.x * 32 + 16,
          targetVector.y * 32 + 24,
          "walk-mark"
        );
        cross.setDepth(2);
        cross.setDisplaySize(32, 32);

        this.scene.time.delayedCall(3000, () => cross.destroy());

        this.moveAlong(vectorPath);
      }
    );

    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_UP);
    });
  }

  getMapMatrix() {
    return createMapMatrix(this.groundLayer);
  }

  moveAlong(path: Phaser.Math.Vector2[]) {
    if (!path || path.length <= 0) {
      return;
    }

    this.movePath = path;
    this.moveTo(this.movePath.shift()!);
  }

  moveTo(target: Phaser.Math.Vector2) {
    this.moveToTarget = target;
  }

  update() {
    const position = this.hero.getTilePos();

    if (position.x !== this.currentX || position.y !== this.currentY) {
      this.room.send("playerMoving", {
        x: position.x,
        y: position.y,
      });

      this.currentY = position.y;
      this.currentX = position.x;
    }

    const cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    //@ts-expect-error
    if (cursors.left.isDown) {
      this.moveToTarget = undefined;
      this.gridPhysics.moveHero(Direction.LEFT);
      //@ts-expect-error
    } else if (cursors.right.isDown) {
      this.moveToTarget = undefined;
      this.gridPhysics.moveHero(Direction.RIGHT);
      //@ts-expect-error
    } else if (cursors.up.isDown) {
      this.moveToTarget = undefined;
      this.gridPhysics.moveHero(Direction.UP);
      //@ts-expect-error
    } else if (cursors.down.isDown) {
      this.moveToTarget = undefined;
      this.gridPhysics.moveHero(Direction.DOWN);
    }

    let dx = 0;
    let dy = 0;

    let { x: heroX, y: heroY } = this.hero.getPosition();

    if (this.moveToTarget) {
      dx = this.moveToTarget.x - heroX;
      dy = this.moveToTarget.y - heroY;

      if (Math.abs(dx) < 5) {
        dx = 0;
      }
      if (Math.abs(dy) < 10) {
        dy = 0;
      }

      if (dx === 0 && dy === 0) {
        if (this.movePath.length > 0) {
          this.moveTo(this.movePath.shift()!);
          return;
        }

        this.moveToTarget = undefined;
      }
    }

    // // this logic is the same except we determine
    // // if a key is down based on dx and dy
    const leftDown = dx < 0;
    const rightDown = dx > 0;
    const upDown = dy < 0;
    const downDown = dy > 0;

    if (leftDown) {
      this.gridPhysics.moveHero(Direction.LEFT);
    } else if (rightDown) {
      this.gridPhysics.moveHero(Direction.RIGHT);
    } else if (upDown) {
      this.gridPhysics.moveHero(Direction.UP);
    } else if (downDown) {
      this.gridPhysics.moveHero(Direction.DOWN);
    }
  }
}
