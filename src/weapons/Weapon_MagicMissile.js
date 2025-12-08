import WeaponBase from './WeaponBase.js';
import Projectile from '../entities/Projectile.js';

export default class WeaponMagicMissile extends WeaponBase {
  fire(time) {
    const target = this.scene.getClosestEnemy(this.owner.x, this.owner.y);
    const aimAngle = target
      ? Phaser.Math.Angle.Between(this.owner.x, this.owner.y, target.x, target.y)
      : this.owner.lastAimDir.angle();
    this.lastFire = time;
    const count = (this.config.projectileCount || 1);
    for (let i = 0; i < count; i++) {
      const p = new Projectile(this.scene, this.owner.x, this.owner.y, 'projectile_blue');
      p.damage = this.config.damage;
      p.speed = this.config.speed;
      p.pierce = this.config.pierce || 0;
      p.fxColor = 0x93c5fd;
      const angle = aimAngle + Phaser.Math.DegToRad((i - (count - 1) / 2) * 6);
      const dir = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
      p.fire(dir);
      this.scene.projectiles.add(p);
    }
  }
}
