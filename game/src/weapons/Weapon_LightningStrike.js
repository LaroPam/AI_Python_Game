import WeaponBase from './WeaponBase.js';

export default class WeaponLightningStrike extends WeaponBase {
  fire(time) {
    this.lastFire = time;
    const count = (this.config.projectileCount || 0) + 1;
    for (let i = 0; i < count; i++) {
      const target = this.scene.getRandomEnemy();
      const x = target ? target.x : this.owner.x + Phaser.Math.Between(-200, 200);
      const y = target ? target.y : this.owner.y + Phaser.Math.Between(-200, 200);
      const strike = this.scene.add.rectangle(x, y, this.config.radius * 2, this.config.radius * 2, 0x38bdf8, 0.4);
      this.scene.time.delayedCall(150, () => {
        this.scene.damageEnemiesInRadius(x, y, this.config.radius, this.config.damage);
        strike.destroy();
      });
    }
  }
}
