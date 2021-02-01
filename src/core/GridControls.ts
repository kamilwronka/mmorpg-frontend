import { Direction } from "./Direction";
import { GridPhysics } from "./GridPhysics";
import { Player } from "./Player";

export class GridControls {
  private key: any;
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics,
    private player: Player
  ) {}

  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;

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
    const cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    //@ts-expect-error
    if (cursors.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT);
      //@ts-expect-error
    } else if (cursors.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
      //@ts-expect-error
    } else if (cursors.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP);
      //@ts-expect-error
    } else if (cursors.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    }

    let dx = 0;
    let dy = 0;

    let { x: playerX, y: playerY } = this.player.getPosition();

    if (this.moveToTarget) {
      dx = this.moveToTarget.x - playerX;
      dy = this.moveToTarget.y - playerY;

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
      this.gridPhysics.movePlayer(Direction.LEFT);
    } else if (rightDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
    } else if (upDown) {
      this.gridPhysics.movePlayer(Direction.UP);
    } else if (downDown) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    }
  }
}
