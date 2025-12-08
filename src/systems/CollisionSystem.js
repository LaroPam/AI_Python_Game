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
    if (this.scene.fx) this.scene.fx.impact(enemy.x, enemy.y, projectile.fxColor || 0xffffff);
    enemy.takeDamage(projectile.damage, projectile);
    projectile.pierce--;
    if (projectile.pierce < 0) projectile.destroy();
  }

  handlePlayerHit(player, enemy) {
    if (this.scene.fx) this.scene.fx.impact(player.x, player.y, 0xff8a8a, 12);
    player.takeDamage(enemy.damage);
  }

  handleEnemyProjectileHit(player, projectile) {
    if (this.scene.fx) this.scene.fx.impact(player.x, player.y, 0xff6b6b, 10);
    player.takeDamage(projectile.damage);
    projectile.destroy();
  }

  collectXP(player, orb) {
    if (this.scene.fx) this.scene.fx.burst(orb.x, orb.y, 0x6ee7b7, 12);
    this.scene.xpSystem.gain(orb.amount);
    orb.destroy();
  }

  collectChest(player, chest) {
    if (this.scene.fx) this.scene.fx.burst(chest.x, chest.y, 0xfacc15, 18);
    chest.destroy();
    this.scene.time.delayedCall(200, () => this.scene.showChestReward());
  }
}
