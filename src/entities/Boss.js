import EnemyProjectile from './EnemyProjectile.js';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    super(scene, x, y, 'boss');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp = data.hp;
    this.speed = data.speed;
    this.damage = data.damage;
    this.behavior = data.behavior;
    this.setScale(1.8);
    this.dataValues = data;
    this.lastAction = 0;
    this.dashing = false;
    this.dashEnd = 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.emit('killed', this);
      this.destroy();
    }
  }

  updateBoss(time, delta, player, enemyProjectiles) {
    if (!player) return;
    const dir = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
    const distance = dir.length();
    dir.normalize();
    if (this.behavior === 'dash') {
      if (this.dashing && time > this.dashEnd) {
        this.dashing = false;
        this.body.setVelocity(0, 0);
      }
      if (!this.dashing && time - this.lastAction > (this.dataValues.dashInterval || 2500)) {
        this.lastAction = time;
        this.dashing = true;
        this.dashEnd = time + (this.dataValues.dashDuration || 600);
        this.body.setVelocity(dir.x * (this.dataValues.dashSpeed || 320), dir.y * (this.dataValues.dashSpeed || 320));
      }
      if (!this.dashing) {
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
      }
    } else if (this.behavior === 'barrage') {
      this.body.setVelocity(dir.x * this.speed * 0.6, dir.y * this.speed * 0.6);
      if (time - this.lastAction > (this.dataValues.fireRate || 1200)) {
        this.lastAction = time;
        const shots = this.dataValues.volley || 5;
        for (let i = 0; i < shots; i++) {
          const angle = Phaser.Math.DegToRad((360 / shots) * i + Phaser.Math.Between(-10, 10));
          const shotDir = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
          const proj = new EnemyProjectile(this.scene, this.x, this.y);
          proj.speed = this.dataValues.projectileSpeed || proj.speed;
          proj.damage = this.damage;
          proj.fire(shotDir);
          enemyProjectiles.add(proj);
        }
      }
    } else {
      this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    }

    if (distance < 48) player.takeDamage(this.damage);
  }
}
