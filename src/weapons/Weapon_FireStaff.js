import WeaponBase from './WeaponBase.js';
import Projectile from '../entities/Projectile.js';

export default class WeaponFireStaff extends WeaponBase {
  fire(time) {
    this.lastFire = time;
    const bursts = (this.config.projectileCount || 0) + 1;
    for (let i = 0; i < bursts; i++) {
      const p = new Projectile(this.scene, this.owner.x, this.owner.y, 'projectile_orange');
      p.damage = this.config.damage;
      p.speed = this.config.speed || 360;
      p.pierce = this.config.pierce || 0;
      const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 359));
      const dir = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
      p.fire(dir);
      this.scene.projectiles.add(p);
    }
  }
}
