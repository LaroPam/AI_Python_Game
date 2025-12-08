import { UI_EVENTS } from '../constants.js';

export default class UpgradeSystem {
  constructor(scene, upgradesData, weaponsData) {
    this.scene = scene;
    this.upgradesData = Array.isArray(upgradesData?.general) ? upgradesData.general : [];
    this.weaponsData = weaponsData || {};
  }

  getRandomUpgrades(count = 3) {
    return this.getRandomOptions(count);
  }

  getRandomOptions(count = 3) {
    const pool = [];
    const player = this.scene.player;
    const weaponIds = Object.keys(this.weaponsData);
    const availableWeapons = weaponIds.filter((id) => {
      const level = player.weaponLevels[id];
      if (level === undefined && player.weapons.length < player.maxWeapons) return true;
      if (level !== undefined && level < 7) return true;
      return false;
    });

    availableWeapons.forEach((id) => {
      const weaponLevel = player.weaponLevels[id] || 0;
      const weaponConfig = this.weaponsData[id];
      const nextUpgrade = weaponConfig.upgrades[weaponLevel - 1] || null;
      pool.push({ type: 'weapon', id, name: weaponConfig.name, level: weaponLevel, upgrade: nextUpgrade, rarity: weaponLevel === 0 ? 'rare' : 'uncommon' });
    });

    this.upgradesData.forEach((up) => pool.push({ ...up, type: up.type || 'stat' }));
    return this.pickWeighted(pool, count);
  }

  pickWeighted(pool, count) {
    const weights = { common: 6, uncommon: 4, rare: 3, epic: 2, legendary: 1 };
    const working = pool.map((p) => ({ ...p, weight: weights[p.rarity] || weights.common }));
    const results = [];
    for (let i = 0; i < count && working.length > 0; i++) {
      const total = working.reduce((sum, item) => sum + item.weight, 0);
      let roll = Math.random() * total;
      let pickedIndex = working.findIndex((item) => {
        roll -= item.weight;
        return roll <= 0;
      });
      if (pickedIndex === -1) pickedIndex = working.length - 1;
      const [picked] = working.splice(Math.max(0, pickedIndex), 1);
      results.push(picked);
    }
    return results;
  }

  applyUpgrade(upgrade) {
    if (upgrade.type === 'weapon') {
      this.applyWeaponUpgrade(upgrade);
      return;
    }
    const stats = this.scene.player.stats;
    stats.speed += upgrade.moveSpeed || 0;
    stats.recovery += upgrade.recovery || 0;
    stats.maxHealth += upgrade.maxHealth || 0;
    stats.magnetRadius += upgrade.magnetRadius || 0;
    stats.attackSpeedBonus += upgrade.attackSpeed || 0;
    stats.armor = (stats.armor || 0) + (upgrade.armor || 0);
    if (upgrade.globalDamage) {
      this.scene.player.weapons.forEach((w) => {
        w.config.damage = Math.round((w.config.damage || 1) * (1 + upgrade.globalDamage));
      });
    }
    if (upgrade.areaSize) {
      this.scene.player.weapons.forEach((w) => {
        w.config.radius = (w.config.radius || 40) * (1 + upgrade.areaSize);
      });
    }
    if (upgrade.auraDamage) {
      this.scene.damageEnemiesInRadius(this.scene.player.x, this.scene.player.y, 160, upgrade.auraDamage);
    }
    if (upgrade.autoMagnet) {
      this.scene.autoMagnet = true;
    }
    if (upgrade.projectileSpeed) {
      this.scene.player.weapons.forEach((w) => { w.config.speed = (w.config.speed || 0) + upgrade.projectileSpeed; });
    }
    if (upgrade.projectileCount) {
      this.scene.player.weapons.forEach((w) => { w.config.projectileCount = (w.config.projectileCount || 0) + upgrade.projectileCount; });
    }
    this.scene.events.emit(UI_EVENTS.UPDATE_STATS);
  }

  applyWeaponUpgrade(upgrade) {
    const weaponConfig = this.weaponsData[upgrade.id];
    if (!weaponConfig) return;
    const added = this.scene.player.addWeapon(upgrade.id, weaponConfig);
    if (!added && this.scene.player.weaponLevels[upgrade.id]) {
      const level = this.scene.player.weaponLevels[upgrade.id];
      const nextUpgrade = weaponConfig.upgrades[level - 1];
      const weaponInstance = this.scene.player.weapons.find((w) => w.id === upgrade.id);
      if (weaponInstance && nextUpgrade) weaponInstance.applyUpgrade(nextUpgrade);
      this.scene.player.weaponLevels[upgrade.id] = Math.min(7, level + 1);
    }
  }
}
