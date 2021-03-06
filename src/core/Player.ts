import { Direction } from "./Direction";
import { GameScene } from "../App";

interface FrameRow {
  leftFoot: number;
  standing: number;
  rightFoot: number;
}

export class Player {
  public static readonly SPRITE_FRAME_WIDTH = 32;
  public static readonly SPRITE_FRAME_HEIGHT = 48;
  public static readonly SCALE_FACTOR = 1;

  private static readonly CHARS_IN_ROW = 1;
  private static readonly FRAMES_PER_CHAR_ROW = 4;
  private static readonly FRAMES_PER_CHAR_COL = 4;
  private directionToFrameRow: { [key in Direction]?: number } = {
    [Direction.DOWN]: 0,
    [Direction.LEFT]: 1,
    [Direction.RIGHT]: 2,
    [Direction.UP]: 3,
  };
  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;

  public lastFootLeft = false;
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    startTilePosX: number,
    startTilePosY: number
  ) {
    this.sprite.scale = Player.SCALE_FACTOR;
    this.sprite.setPosition(
      startTilePosX * GameScene.TILE_SIZE + this.playerOffsetX(),
      startTilePosY * GameScene.TILE_SIZE + this.playerOffsetY()
    );
    this.sprite.setFrame(this.framesOfDirection(Direction.DOWN).standing);
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  setWalkingFrame(direction: Direction): void {
    const frameRow = this.framesOfDirection(direction);
    this.sprite.setFrame(
      this.lastFootLeft ? frameRow.rightFoot : frameRow.leftFoot
    );
  }

  setStandingFrame(direction: Direction): void {
    if (this.isCurrentFrameStanding(direction)) {
      this.lastFootLeft = !this.lastFootLeft;
    }
    this.sprite.setFrame(this.framesOfDirection(direction).standing);
  }

  getTilePos(): Phaser.Math.Vector2 {
    const x =
      (this.sprite.getCenter().x - this.playerOffsetX()) / GameScene.TILE_SIZE;
    const y =
      (this.sprite.getCenter().y + this.playerOffsetY()) / GameScene.TILE_SIZE;
    return new Phaser.Math.Vector2(Math.floor(x), Math.floor(y));
  }

  private isCurrentFrameStanding(direction: Direction): boolean {
    return (
      Number(this.sprite.frame.name) !==
      this.framesOfDirection(direction).standing
    );
  }

  private playerOffsetX(): number {
    return GameScene.TILE_SIZE / 2;
  }
  private playerOffsetY(): number {
    return (
      -(
        (Player.SPRITE_FRAME_HEIGHT * Player.SCALE_FACTOR) %
        GameScene.TILE_SIZE
      ) / 2
    );
  }

  private framesOfDirection(direction: Direction): FrameRow {
    const playerCharRow = 0;
    const playerCharCol = 0;
    const framesInRow = Player.CHARS_IN_ROW * Player.FRAMES_PER_CHAR_ROW;
    const framesInSameRowBefore = Player.FRAMES_PER_CHAR_ROW * playerCharCol;
    // @ts-nocheck
    const rows =
      // @ts-expect-error: ignore
      this.directionToFrameRow[direction] +
      playerCharRow * Player.FRAMES_PER_CHAR_COL;
    const startFrame = framesInSameRowBefore + rows * framesInRow;
    return {
      leftFoot: startFrame + 1,
      standing: startFrame + 2,
      rightFoot: startFrame + 3,
    };
  }
}
