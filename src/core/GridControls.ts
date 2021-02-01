import { Direction } from "./Direction";
import { GridPhysics } from "./GridPhysics";

export class GridControls {
  private key: any;
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {}

  update() {
    const cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // const wBtn = this.input.keyboard.checkDown(Phaser.Input.Keyboard.Key)

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
  }
}
