export default class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'enemyProjectile') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = 200;
    this.damage = 4;
    this.lifespan = 3500;
    this.spawnTime = scene.time.now;
    this.body.setAllowGravity(false);
    this.body.setImmovable(false);
    this.body.setDrag(0);
  }

  fire(direction) {
    const dir = direction.clone().normalize();
    if (dir.lengthSq() === 0) dir.set(1, 0);
    this.setActive(true).setVisible(true);
    this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
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
