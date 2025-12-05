export default class WeaponBase {
  constructor(scene, owner, config) {
    this.scene = scene;
    this.owner = owner;
    this.config = { ...config };
    this.lastFire = 0;
  }

  canFire(time) {
    return time - this.lastFire >= Math.max(100, (this.config.cooldown || 0) * (1 - (this.owner.stats.attackSpeedBonus || 0)));
  }

  fire(time) {
    this.lastFire = time;
  }

  update(time, delta) {
    if (this.canFire(time)) this.fire(time, delta);
  }
}
