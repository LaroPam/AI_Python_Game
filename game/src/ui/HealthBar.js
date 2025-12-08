export default class HealthBar extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width = 220, height = 14) {
    super(scene, x, y);
    this.bg = scene.add.rectangle(0, 0, width, height, 0x1f2937).setOrigin(0, 0.5);
    this.bar = scene.add.rectangle(0, 0, width, height, 0x10b981).setOrigin(0, 0.5);
    this.text = scene.add.text(width + 8, -height / 2, 'HP', { fontSize: '12px', color: '#fff' });
    this.add([this.bg, this.bar, this.text]);
    scene.add.existing(this);
  }

  updateValue(current, max) {
    const ratio = Phaser.Math.Clamp(current / max, 0, 1);
    this.bar.width = this.bg.width * ratio;
    this.text.setText(`HP ${Math.round(current)}/${Math.round(max)}`);
  }
}
