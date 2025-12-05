export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    super(scene, x, y, 'boss');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp = data.hp;
    this.speed = data.speed;
    this.damage = data.damage;
    this.setScale(1.8);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.emit('killed', this);
      this.destroy();
    }
  }
}
