import { WORLD_SIZE } from '../constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.json('weaponsData', 'src/data/weapons.json');
    this.load.json('enemiesData', 'src/data/enemies.json');
    this.load.json('upgradesData', 'src/data/upgrades.json');
    this.load.json('wavesData', 'src/data/waves.json');
    this.load.json('balanceData', 'src/data/balance.json');
  }

  create() {
    // Create simple procedural textures to avoid missing assets
    const g = this.add.graphics();
    g.fillStyle(0x4ade80); g.fillCircle(16, 16, 14); g.generateTexture('player', 32, 32); g.clear();
    g.fillStyle(0xef4444); g.fillRect(0, 0, 24, 24); g.generateTexture('enemy', 24, 24); g.clear();
    g.fillStyle(0x0ea5e9); g.fillRect(0, 0, 12, 12); g.generateTexture('projectile', 12, 12); g.clear();
    g.lineStyle(2, 0xf97316); g.strokeCircle(16, 16, 16); g.generateTexture('aura', 32, 32); g.clear();
    g.fillStyle(0xfacc15); g.fillCircle(8, 8, 8); g.generateTexture('xp', 16, 16); g.clear();
    g.fillStyle(0xa855f7); g.fillRect(0, 0, 20, 14); g.generateTexture('chest', 20, 14); g.clear();
    g.fillStyle(0x1f2937); g.fillRect(0, 0, 64, 64); g.generateTexture('tile', 64, 64); g.clear();
    g.fillStyle(0xb91c1c); g.fillRect(0, 0, 48, 48); g.generateTexture('boss', 48, 48); g.clear();

    this.registry.set('worldSize', WORLD_SIZE);
    this.scene.start('PreloadScene');
  }
}
