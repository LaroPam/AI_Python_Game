export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  setup() {
    const { physics, player, enemies, projectiles, xpGroup, lootGroup, bossGroup } = this.scene;
    physics.add.overlap(projectiles, enemies, this.handleProjectileHit, undefined, this);
    physics.add.overlap(player, enemies, this.handlePlayerHit, undefined, this);
    physics.add.overlap(player, bossGroup, this.handlePlayerHit, undefined, this);
    physics.add.overlap(player, xpGroup, this.collectXP, undefined, this);
    physics.add.overlap(player, lootGroup, this.collectChest, undefined, this);
  }

  handleProjectileHit(projectile, enemy) {
    enemy.takeDamage(projectile.damage);
    projectile.pierce--;
    if (projectile.pierce < 0) projectile.destroy();
  }

  handlePlayerHit(player, enemy) {
    player.takeDamage(enemy.damage);
  }

  collectXP(player, orb) {
    this.scene.xpSystem.gain(orb.amount);
    orb.destroy();
  }

  collectChest(player, chest) {
    chest.destroy();
    this.scene.time.delayedCall(200, () => this.scene.showChestReward());
  }
}
