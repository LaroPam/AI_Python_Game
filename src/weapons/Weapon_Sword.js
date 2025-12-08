import WeaponBase from './WeaponBase.js';

export default class WeaponSword extends WeaponBase {
  fire(time) {
    this.lastFire = time;
    const swings = (this.config.projectileCount || 0) + 1;
    const dir = this.owner.lastMoveDir.clone().normalize();
    if (dir.lengthSq() === 0) dir.set(1, 0);
    for (let i = 0; i < swings; i++) {
      const angle = Phaser.Math.DegToRad(-25 + (50 / Math.max(1, swings - 1)) * i);
      const rotated = dir.clone().rotate(angle);
      const hitX = this.owner.x + rotated.x * (this.config.radius + 20);
      const hitY = this.owner.y + rotated.y * (this.config.radius + 20);
      const arc = this.scene.add.arc(hitX, hitY, this.config.radius, 200, 340, false, 0xfacc15, 0.25);
      this.scene.time.delayedCall(80, () => {
        if (this.scene.fx) this.scene.fx.shockwave(hitX, hitY, 0xfacc15, 12);
        this.scene.damageEnemiesInRadius(hitX, hitY, this.config.radius, this.config.damage, true, 0xfacc15);
        arc.destroy();
      });
    }
  }
}
