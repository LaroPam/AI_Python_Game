export default class FloatingText {
  constructor(scene) {
    this.scene = scene;
  }

  show(x, y, text, color = '#fff') {
    const t = this.scene.add.text(x, y, text, { fontSize: '14px', color });
    this.scene.tweens.add({ targets: t, y: y - 24, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }
}
