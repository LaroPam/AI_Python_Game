import { WORLD_SIZE } from '../constants.js';

const dataPath = (file) => new URL(`../data/${file}.json`, import.meta.url).href;

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load JSON via module-relative URLs so hosting under any base path (root, subfolder, or
    // previously used /game/) continues to work after the directory move.
    this.load.json('weaponsData', dataPath('weapons'));
    this.load.json('enemiesData', dataPath('enemies'));
    this.load.json('upgradesData', dataPath('upgrades'));
    this.load.json('wavesData', dataPath('waves'));
    this.load.json('balanceData', dataPath('balance'));
  }

  create() {
    // Ensure the data made it into cache; if any failed, log an error so the user
    // knows why startup might not proceed.
    const datasets = ['weaponsData', 'enemiesData', 'upgradesData', 'wavesData', 'balanceData'];
    datasets.forEach((key) => {
      if (!this.cache.json.exists(key)) {
        console.error(`Failed to load JSON: ${key}`);
      }
    });

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
