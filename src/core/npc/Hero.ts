import { Direction } from "../movement/Direction";
import { TILE_SIZE } from "../constants/map";
import { Character, CharacterOptions } from "./Character";
import { BasicScene } from "../scenes/BasicScene";

export class Hero extends Character {
  // constructor(
  //   scene: BasicScene,
  //   startTilePosX: number,
  //   startTilePosY: number,
  //   texture: string,
  //   options: CharacterOptions,
  // ) {
  //   super(scene, startTilePosX, startTilePosY, texture, options)
  //   t
  // }

  // setPos(x: number, y: number) {
  //   this.setSpritePosition(x, y);
  // }

  setWalkingFrame(direction: Direction): void {
    const frameRow = this.framesOfDirection(direction);
    this.setFrame(this.lastFootLeft ? frameRow.rightFoot : frameRow.leftFoot);
  }

  setStandingFrame(direction: Direction): void {
    if (this.isCurrentFrameStanding(direction)) {
      this.lastFootLeft = !this.lastFootLeft;
    }
    this.setFrame(this.framesOfDirection(direction).standing);
  }

  getTilePos(): Phaser.Math.Vector2 {
    const x = (this.getCenter().x - this.heroOffsetX()) / TILE_SIZE;
    const y = (this.getCenter().y + this.heroOffsetY()) / TILE_SIZE;
    return new Phaser.Math.Vector2(Math.floor(x), Math.floor(y));
  }

  private isCurrentFrameStanding(direction: Direction): boolean {
    return (
      Number(this.frame.name) !== this.framesOfDirection(direction).standing
    );
  }
}
