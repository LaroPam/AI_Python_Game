import WeaponBase from './WeaponBase.js';
import Projectile from '../entities/Projectile.js';

export default class WeaponCrossbow extends WeaponBase {
  fire(time) {
    this.lastFire = time;
    const target = this.scene.getClosestEnemy(this.owner.x, this.owner.y);
    const aimAngle = target
      ? Phaser.Math.Angle.Between(this.owner.x, this.owner.y, target.x, target.y)
      : this.owner.lastAimDir.angle();
    const shots = (this.config.projectileCount || 0) + 1;
    for (let i = 0; i < shots; i++) {
      const p = new Projectile(this.scene, this.owner.x, this.owner.y, 'projectile_orange');
      p.damage = this.config.damage;
      p.speed = this.config.speed || 520;
      p.pierce = this.config.pierce || 0;
      p.fxColor = 0xf97316;
      const angle = aimAngle + Phaser.Math.DegToRad((i - (shots - 1) / 2) * 6);
      const dir = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
      p.fire(dir);
      this.scene.projectiles.add(p);
    }
  }
}
