import WeaponBase from './WeaponBase.js';
import Projectile from '../entities/Projectile.js';

export default class WeaponBoomerang extends WeaponBase {
  fire(time) {
    this.lastFire = time;
    const count = (this.config.projectileCount || 0) + 1;
    for (let i = 0; i < count; i++) {
      const p = new Projectile(this.scene, this.owner.x, this.owner.y);
      p.damage = this.config.damage;
      p.speed = this.config.speed;
      p.pierce = this.config.pierce || 0;
      const angle = this.owner.body.velocity.angle() + Phaser.Math.DegToRad((i - (count - 1) / 2) * 15);
      const dir = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
      p.fire(dir.length() === 0 ? new Phaser.Math.Vector2(1, 0) : dir);
      this.scene.projectiles.add(p);
      this.scene.tweens.add({ targets: p, props: { x: p.x - dir.x * (this.config.radius + 140), y: p.y - dir.y * (this.config.radius + 140) }, duration: 600, yoyo: true });
    }
  }
}
