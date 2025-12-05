export default class XPBar extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width = 220, height = 10) {
    super(scene, x, y);
    this.bg = scene.add.rectangle(0, 0, width, height, 0x111827).setOrigin(0, 0.5);
    this.bar = scene.add.rectangle(0, 0, width, height, 0x38bdf8).setOrigin(0, 0.5);
    this.text = scene.add.text(width + 8, -height / 2, 'XP', { fontSize: '12px', color: '#fff' });
    this.add([this.bg, this.bar, this.text]);
    scene.add.existing(this);
  }

  updateValue(current, nextLevel, level) {
    const ratio = Phaser.Math.Clamp(current / nextLevel, 0, 1);
    this.bar.width = this.bg.width * ratio;
    this.text.setText(`LVL ${level}`);
  }
}
