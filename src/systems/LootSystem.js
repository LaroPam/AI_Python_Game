import EntityFactory from '../core/EntityFactory.js';

export default class LootSystem {
  constructor(scene) {
    this.scene = scene;
    this.factory = new EntityFactory(scene);
  }

  dropXP(x, y, amount) {
    const orb = this.factory.createXPOrb(x, y, amount);
    this.scene.xpGroup.add(orb);
    if (this.scene.fx) this.scene.fx.burst(x, y, 0x22c55e, 10);
  }

  dropChest(x, y) {
    const chest = this.factory.createLootChest(x, y, 1);
    this.scene.lootGroup.add(chest);
    if (this.scene.fx) this.scene.fx.burst(x, y, 0xfacc15, 14);
  }
}
