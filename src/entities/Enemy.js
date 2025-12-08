import EnemyProjectile from './EnemyProjectile.js';
import { UI_EVENTS } from '../constants.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.typeData = data || {};
    this.hp = this.typeData.hp ?? 15;
    this.speed = this.typeData.speed ?? 70;
    this.damage = this.typeData.damage ?? 5;
    this.behavior = this.typeData.behavior || 'chase';
    this.lastAction = 0;
    this.setTexture(this.typeData.texture || 'enemy');
    this.setTint(this.typeData.tint || 0xffffff);
    this.setCircle(10, 2, 2);
  }

  takeDamage(amount, source = null) {
    this.hp -= amount;
    if (source && source.body) {
      const knockDir = new Phaser.Math.Vector2(this.x - source.x, this.y - source.y).normalize();
      this.body.setVelocity(knockDir.x * 160, knockDir.y * 160);
    }
    this.scene.events.emit(UI_EVENTS.DAMAGE_NUMBER, { x: this.x, y: this.y, amount });
    if (this.hp <= 0) {
      this.emit('killed', this);
      this.destroy();
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    const player = this.scene.player;
    if (!player) return;
    const dir = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
    const distance = dir.length();
    if (distance > 0) dir.scale(1 / distance);

    // Simple culling/relaxation when far from camera to reduce lag on large crowds
    const view = this.scene.cameras.main.worldView;
    const crowded = this.scene.enemies.countActive(true) > 250;
    if (!view.contains(this.x, this.y) && crowded) {
      this.body.setVelocity(0, 0);
      return;
    }

    switch (this.behavior) {
      case 'shoot':
        this.body.setVelocity(dir.x * this.speed * 0.6, dir.y * this.speed * 0.6);
        if (time - this.lastAction > (this.typeData.fireRate || 1600) && distance < 520) {
          this.lastAction = time;
          const proj = new EnemyProjectile(this.scene, this.x, this.y, 'enemyProjectile');
          proj.speed = this.typeData.projectileSpeed || proj.speed;
          proj.damage = this.damage;
          proj.fire(dir);
          this.scene.enemyProjectiles.add(proj);
        }
        break;
      case 'suicide':
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
        if (distance < (this.typeData.explosionRadius || 80)) {
          player.takeDamage(this.damage);
          this.emit('killed', this);
          this.destroy();
        }
        break;
      default:
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
        break;
    }
  }
}
