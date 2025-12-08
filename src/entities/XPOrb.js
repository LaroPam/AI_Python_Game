export default class XPOrb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, amount = 1) {
    super(scene, x, y, 'xp');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.amount = amount;
    this.body.setAllowGravity(false);
    this.setDepth(1);
  }
}
