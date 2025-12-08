export default class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'enemyProjectile') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = 200;
    this.damage = 4;
    this.lifespan = 3500;
    this.spawnTime = scene.time.now;
    this.fireDir = new Phaser.Math.Vector2(1, 0);
    this.body.setAllowGravity(false);
    this.body.setImmovable(false);
    this.body.setDrag(0);
  }

  fire(direction) {
    const dir = direction.clone().normalize();
    if (dir.lengthSq() === 0) dir.set(1, 0);
    this.fireDir.copy(dir);
    this.setActive(true).setVisible(true);
    this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    this.setRotation(dir.angle());
    this.scene.tweens.add({ targets: this, scale: { from: 0.6, to: 1 }, duration: 120, ease: 'sine.out' });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.body.velocity.lengthSq() < 1) {
      this.body.setVelocity(this.fireDir.x * this.speed, this.fireDir.y * this.speed);
    }
    const { worldView } = this.scene.cameras.main;
    if (!worldView.contains(this.x, this.y)) {
      this.destroy();
      return;
    }
    if (time - this.spawnTime > this.lifespan) {
      this.destroy();
    }
  }
}
