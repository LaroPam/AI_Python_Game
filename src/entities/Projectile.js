export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'projectile') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = 400;
    this.damage = 5;
    this.pierce = 0;
    this.lifespan = 2500;
    this.spawnTime = scene.time.now;
  }

  fire(direction) {
    this.setActive(true).setVisible(true);
    this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (time - this.spawnTime > this.lifespan) {
      this.destroy();
    }
  }
}
