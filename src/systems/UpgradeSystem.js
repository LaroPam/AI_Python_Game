export default class UpgradeSystem {
  constructor(scene, upgradesData) {
    this.scene = scene;
    this.upgradesData = upgradesData.general;
  }

  getRandomUpgrades(count = 3) {
    const pool = Phaser.Utils.Array.Shuffle([...this.upgradesData]);
    return pool.slice(0, count);
  }

  applyUpgrade(upgrade) {
    const stats = this.scene.player.stats;
    stats.speed += upgrade.moveSpeed || 0;
    stats.recovery += upgrade.recovery || 0;
    stats.maxHealth += upgrade.maxHealth || 0;
    stats.magnetRadius += upgrade.magnetRadius || 0;
    stats.attackSpeedBonus += upgrade.attackSpeed || 0;
    stats.armor = (stats.armor || 0) + (upgrade.armor || 0);
    if (upgrade.auraDamage) {
      this.scene.damageEnemiesInRadius(this.scene.player.x, this.scene.player.y, 160, upgrade.auraDamage);
    }
    if (upgrade.autoMagnet) {
      this.scene.autoMagnet = true;
    }
  }
}
