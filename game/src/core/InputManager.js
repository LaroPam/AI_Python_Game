export default class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys('W,A,S,D');
  }

  getDirection() {
    const { left, right, up, down } = this.cursorKeys;
    const w = this.wasd.W, a = this.wasd.A, s = this.wasd.S, d = this.wasd.D;
    let x = 0; let y = 0;
    if (left.isDown || a.isDown) x -= 1;
    if (right.isDown || d.isDown) x += 1;
    if (up.isDown || w.isDown) y -= 1;
    if (down.isDown || s.isDown) y += 1;
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }
}
