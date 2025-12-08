export default class MiniMap extends Phaser.GameObjects.Container {
  constructor(scene, x, y, size = 160) {
    super(scene, x, y);
    this.size = size;
    this.bg = scene.add.rectangle(0, 0, size, size, 0x0f172a, 0.6).setOrigin(0);
    this.marker = scene.add.rectangle(0, 0, 6, 6, 0x38bdf8).setOrigin(0.5);
    this.add([this.bg, this.marker]);
    scene.add.existing(this);
  }

  updatePosition(player, worldSize) {
    const px = Phaser.Math.Clamp(player.x / worldSize, 0, 1);
    const py = Phaser.Math.Clamp(player.y / worldSize, 0, 1);
    this.marker.x = px * this.size;
    this.marker.y = py * this.size;
  }
}
