import { Direction } from "./Direction";
import { Hero } from "../npc/Hero";
import { TILE_SIZE } from "../constants/map";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private movementDirection = Direction.NONE;
  private readonly speedPixelsPerSecond: number = TILE_SIZE * 4;
  private tileSizePixelsWalked: number = 0;
  private decimalPlacesLeft = 0;
  private movementDirectionVectors: {
    [key in Direction]?: Vector2;
  } = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT,
  };

  constructor(private hero: Hero, private tileMap: Phaser.Tilemaps.Tilemap) {}

  moveHero(direction: Direction): void {
    if (this.isMoving()) return;
    if (this.isBlockingDirection(direction)) {
      this.hero.setStandingFrame(direction);
    } else {
      this.startMoving(direction);
    }
  }

  update(delta: number): void {
    if (this.isMoving()) {
      this.updateHeroPosition(delta);
    }
  }

  private isMoving(): boolean {
    return this.movementDirection !== Direction.NONE;
  }

  private startMoving(direction: Direction): void {
    this.movementDirection = direction;
  }

  private tilePosInDirection(direction: Direction): Vector2 {
    return (
      this.hero
        .getTilePos()
        // @ts-expect-error: ignore
        .add(this.movementDirectionVectors[direction])
    );
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  private hasNoTile(pos: Vector2): boolean {
    return !this.tileMap.hasTileAt(pos.x, pos.y, this.tileMap.layers[1].name);
  }

  private hasBlockingTile(pos: Vector2): boolean {
    if (this.hasNoTile(pos)) return true;
    const tileAtPosition = this.tileMap.getTileAt(
      pos.x,
      pos.y,
      false,
      this.tileMap.layers[1].name
    );

    return tileAtPosition && tileAtPosition.properties.collides;
  }

  private updateHeroPosition(delta: number): void {
    this.decimalPlacesLeft = this.getDecimalPlaces(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    );
    const pixelsToWalkThisUpdate = this.getIntegerPart(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    );

    if (this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.moveHeroSpriteRestOfTile();
    } else {
      this.moveHeroSprite(pixelsToWalkThisUpdate);
    }
  }

  private getIntegerPart(float: number): number {
    return Math.floor(float);
  }

  private getDecimalPlaces(float: number): number {
    return float % 1;
  }

  private getSpeedPerDelta(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  private willCrossTileBorderThisUpdate(
    pixelsToWalkThisUpdate: number
  ): boolean {
    return this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= TILE_SIZE;
  }

  private moveHeroSpriteRestOfTile(): void {
    this.moveHeroSprite(TILE_SIZE - this.tileSizePixelsWalked);
    this.stopMoving();
  }

  private moveHeroSprite(speed: number): void {
    const newHeroPos = this.hero
      .getPosition()
      .add(this.movementDistance(speed));
    this.hero.setSpritePosition(newHeroPos);
    this.tileSizePixelsWalked += speed;
    this.updateHeroFrame(this.movementDirection, this.tileSizePixelsWalked);
    this.tileSizePixelsWalked %= TILE_SIZE;
  }

  private updateHeroFrame(
    direction: Direction,
    tileSizePixelsWalked: number
  ): void {
    if (this.hasWalkedHalfATile(tileSizePixelsWalked)) {
      this.hero.setStandingFrame(direction);
    } else {
      this.hero.setWalkingFrame(direction);
    }
  }

  private hasWalkedHalfATile(tileSizePixelsWalked: number): boolean {
    return tileSizePixelsWalked > TILE_SIZE / 2;
  }

  private stopMoving(): void {
    this.movementDirection = Direction.NONE;
  }
  // @ts-expect-error: ignore
  private movementDistance(speed): Vector2 {
    // @ts-expect-error: ignore
    return this.movementDirectionVectors[this.movementDirection]
      .clone()
      .multiply(new Vector2(speed));
  }
}
