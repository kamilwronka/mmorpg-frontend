export class LoadingOverlay {
  scene: Phaser.Scene;
  progressBox: any;
  progressBar: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.setupListeners();

    this.progressBar = this.scene.add.graphics({
      x: this.scene.game.canvas.width / 2 - 175,
      y: this.scene.game.canvas.height / 2 - 25,
    });

    this.progressBox = this.scene.add.graphics({
      x: this.scene.game.canvas.width / 2 - 175,
      y: this.scene.game.canvas.height / 2 - 25,
    });
  }

  setupListeners() {
    this.scene.load.on("progress", (value: any) => {
      this.renderProgressBar(value);
    });

    this.scene.load.on("complete", () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
    });
  }

  renderProgressBar(value: number) {
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(10, 40, 300 * value, 30);
  }

  renderProgressBox() {
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(0, 30, 350, 50);
  }
}
