import EntityFactory from '../core/EntityFactory.js';

export default class EnemySpawner {
  constructor(scene, enemiesData) {
    this.scene = scene;
    this.factory = new EntityFactory(scene);
    this.enemiesData = enemiesData.types;
    this.spawnInterval = 1200;
    this.lastSpawn = 0;
  }

  spawn(typeId) {
    const data = this.enemiesData.find((e) => e.id === typeId) || this.enemiesData[0];
    const padding = 300;
    const dir = Phaser.Math.Between(0, 3);
    const x = dir % 2 === 0 ? -padding : this.scene.worldSize + padding;
    const y = dir < 2 ? Phaser.Math.Between(0, this.scene.worldSize) : -padding;
    const enemy = this.factory.createEnemy({ x, y, typeData: data });
    this.scene.enemies.add(enemy);
    return enemy;
  }
}
