export default class XPSystem {
  constructor(scene) {
    this.scene = scene;
    this.level = 1;
    this.currentXp = 0;
    this.nextLevelXp = 20;
  }

  gain(amount) {
    this.currentXp += amount;
    if (this.currentXp >= this.nextLevelXp) {
      this.currentXp -= this.nextLevelXp;
      this.level++;
      this.nextLevelXp = Math.floor(this.nextLevelXp * 1.2 + 10);
      this.scene.handleLevelUp(this.level);
    }
  }
}
