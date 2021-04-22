import Phaser from "phaser";

export const createMapMatrix = (groundLayer: Phaser.Tilemaps.TilemapLayer) => {
  const mapMatrix = groundLayer.layer.data.map(
    (row: Phaser.Tilemaps.Tile[]): any[] => {
      return row.map((tile: Phaser.Tilemaps.Tile): number => {
        return tile.properties.collides ? 1 : 0;
      });
    }
  );

  return mapMatrix;
};
