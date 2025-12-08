import EntityFactory from '../core/EntityFactory.js';

export default class EnemySpawner {
  constructor(scene, enemiesData) {
    this.scene = scene;
    this.factory = new EntityFactory(scene);
    this.enemiesData = Array.isArray(enemiesData?.types) ? enemiesData.types : [];
    this.spawnInterval = 1200;
    this.lastSpawn = 0;
  }

  spawn(typeId) {
    const data = this.enemiesData.find((e) => e.id === typeId) || this.enemiesData[0];
    if (!data) return null;
    const padding = 300;
    const dir = Phaser.Math.Between(0, 3);
    const x = dir % 2 === 0 ? -padding : this.scene.worldSize + padding;
    const y = dir < 2 ? Phaser.Math.Between(0, this.scene.worldSize) : -padding;
    const difficulty = this.scene.waveManager.getDifficultyScale();
    const scaledData = {
      ...data,
      hp: Math.floor(data.hp * difficulty),
      damage: Math.floor(data.damage * difficulty),
      speed: Math.floor(data.speed * (1 + (difficulty - 1) * 0.35))
    };
    const enemy = this.factory.createEnemy({ x, y, typeData: scaledData });
    this.scene.enemies.add(enemy);
    if (this.scene.fx) this.scene.fx.burst(x, y, scaledData.tint || 0xffffff, 8);
    return enemy;
  }
}
