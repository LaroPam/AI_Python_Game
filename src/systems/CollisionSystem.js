export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  setup() {
    const { physics, player, enemies, projectiles, xpGroup, lootGroup, bossGroup, enemyProjectiles } = this.scene;
    physics.add.overlap(projectiles, enemies, this.handleProjectileHit, undefined, this);
    physics.add.overlap(projectiles, bossGroup, this.handleProjectileHit, undefined, this);
    physics.add.collider(enemies, enemies);
    physics.add.collider(player, enemies);
    physics.add.overlap(player, enemies, this.handlePlayerHit, undefined, this);
    physics.add.overlap(player, bossGroup, this.handlePlayerHit, undefined, this);
    physics.add.overlap(player, xpGroup, this.collectXP, undefined, this);
    physics.add.overlap(player, lootGroup, this.collectChest, undefined, this);
    physics.add.overlap(player, enemyProjectiles, this.handleEnemyProjectileHit, undefined, this);
  }

  handleProjectileHit(projectile, enemy) {
    enemy.takeDamage(projectile.damage);
    projectile.pierce--;
    if (projectile.pierce < 0) projectile.destroy();
  }

  handlePlayerHit(player, enemy) {
    player.takeDamage(enemy.damage);
  }

  handleEnemyProjectileHit(player, projectile) {
    player.takeDamage(projectile.damage);
    projectile.destroy();
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
