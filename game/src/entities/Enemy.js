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
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.emit('killed', this);
      this.destroy();
    }
  }
}
