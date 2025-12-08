import EnemyProjectile from './EnemyProjectile.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.typeData = data;
    this.hp = data.hp;
    this.speed = data.speed;
    this.damage = data.damage;
    this.behavior = data.behavior;
    this.lastAction = 0;
    this.setCircle(10, 2, 2);
  }

  takeDamage(amount) {
    this.hp -= amount;
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
    dir.normalize();

    switch (this.behavior) {
      case 'shoot':
        this.body.setVelocity(dir.x * this.speed * 0.6, dir.y * this.speed * 0.6);
        if (time - this.lastAction > (this.typeData.fireRate || 1600) && distance < 520) {
          this.lastAction = time;
          const proj = new EnemyProjectile(this.scene, this.x, this.y);
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
