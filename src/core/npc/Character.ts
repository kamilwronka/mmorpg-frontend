import * as Phaser from "phaser";
import { createAdd } from "typescript";
import { TILE_SIZE } from "../constants/map";
import { SCENES } from "../constants/scenes";
import { game } from "../Game";
import { Direction } from "../movement/Direction";

export interface CharacterOptions {
  name: string;
  spriteUrl: string;
  frameHeight: number;
  frameWidth: number;
  x?: number;
  y?: number;
}

export interface CharacterRenderOptions {
  texture: string;
  spriteUrl: string;
  x: number;
  y: number;
}

export interface LoadCharacterSpriteRequest {
  name: string;
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
}

interface FrameRow {
  leftFoot: number;
  standing: number;
  rightFoot: number;
}

export class Character extends Phaser.GameObjects.Sprite {
  public static readonly SPRITE_FRAME_WIDTH = 32;
  public static readonly SPRITE_FRAME_HEIGHT = 48;
  public static readonly SCALE_FACTOR = 1;
  static readonly CHARS_IN_ROW = 1;
  static readonly FRAMES_PER_CHAR_ROW = 4;
  static readonly FRAMES_PER_CHAR_COL = 4;
  static readonly DEFAULT_DEPTH = 3;

  directionToFrameRow: { [key in Direction]?: number } = {
    [Direction.DOWN]: 0,
    [Direction.LEFT]: 1,
    [Direction.RIGHT]: 2,
    [Direction.UP]: 3,
  };

  public lastFootLeft = false;

  characterOptions: CharacterOptions;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    options: CharacterOptions
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.characterOptions = options;

    this.scene.add.existing(this);

    this.loadCharacterSprite(options);

    this.setDepth(Character.DEFAULT_DEPTH);

    this.scale = Character.SCALE_FACTOR;
    this.setPosition(
      x * TILE_SIZE + this.heroOffsetX(),
      y * TILE_SIZE + this.heroOffsetY()
    );
    this.setFrame(this.framesOfDirection(Direction.DOWN).standing);
  }

  loadCharacterSprite({
    name,
    spriteUrl,
    frameHeight,
    frameWidth,
  }: LoadCharacterSpriteRequest): void {
    this.scene.load.on(Phaser.Loader.Events.START, () => {
      this.scene.load.spritesheet(name, spriteUrl, {
        frameWidth,
        frameHeight,
      });

      this.scene.load.removeListener(Phaser.Loader.Events.START);
    });

    this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.setTexture(name);

      this.scene.load.removeListener(Phaser.Loader.Events.COMPLETE);
    });
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.getCenter();
  }

  setSpritePosition(position: Phaser.Math.Vector2): void {
    this.setPosition(position.x, position.y);
  }

  heroOffsetX(): number {
    return TILE_SIZE / 2;
  }
  heroOffsetY(): number {
    return (
      -((Character.SPRITE_FRAME_HEIGHT * Character.SCALE_FACTOR) % TILE_SIZE) /
      2
    );
  }

  framesOfDirection(direction: Direction): FrameRow {
    const heroCharRow = 0;
    const heroCharCol = 0;
    const framesInRow = Character.CHARS_IN_ROW * Character.FRAMES_PER_CHAR_ROW;
    const framesInSameRowBefore = Character.FRAMES_PER_CHAR_ROW * heroCharCol;
    // @ts-nocheck
    const rows =
      // @ts-expect-error: ignore
      this.directionToFrameRow[direction] +
      heroCharRow * Character.FRAMES_PER_CHAR_COL;
    const startFrame = framesInSameRowBefore + rows * framesInRow;
    return {
      leftFoot: startFrame + 1,
      standing: startFrame + 2,
      rightFoot: startFrame + 3,
    };
  }
}
