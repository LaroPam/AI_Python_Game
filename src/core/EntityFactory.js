import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import XPOrb from '../entities/XPOrb.js';
import LootChest from '../entities/LootChest.js';

export default class EntityFactory {
  constructor(scene) {
    this.scene = scene;
  }

  createPlayer(x, y, config) {
    return new Player(this.scene, x, y, config);
  }

  createEnemy(data) {
    const enemy = new Enemy(this.scene, data.x, data.y, data.typeData);
    enemy.setData('type', data.typeData.id);
    return enemy;
  }

  createBoss(x, y, data) {
    return new Boss(this.scene, x, y, data);
  }

  createXPOrb(x, y, amount) {
    return new XPOrb(this.scene, x, y, amount);
  }

  createLootChest(x, y, tier = 1) {
    return new LootChest(this.scene, x, y, tier);
  }
}
