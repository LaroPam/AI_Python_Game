import EntityFactory from '../core/EntityFactory.js';

export default class LootSystem {
  constructor(scene) {
    this.scene = scene;
    this.factory = new EntityFactory(scene);
  }

  dropXP(x, y, amount) {
    const orb = this.factory.createXPOrb(x, y, amount);
    this.scene.xpGroup.add(orb);
  }

  dropChest(x, y) {
    const chest = this.factory.createLootChest(x, y, 1);
    this.scene.lootGroup.add(chest);
  }
}
