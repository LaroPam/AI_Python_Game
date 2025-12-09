export default class LootChest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, tier = 1) {
    super(scene, x, y, 'chest');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.tier = tier;
    this.body.setImmovable(true);
    this.setInteractive();
  }
}
