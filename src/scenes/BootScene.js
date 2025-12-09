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
    g.fillStyle(0xffffff); g.fillRect(4, 0, 16, 16); g.fillRect(0, 16, 24, 8); g.generateTexture('enemy_skeleton', 24, 24); g.clear();
    g.fillStyle(0x22c55e); g.fillRect(2, 2, 20, 20); g.generateTexture('enemy_runner', 24, 24); g.clear();
    g.fillStyle(0x7c3aed); g.fillRect(2, 2, 20, 20); g.generateTexture('enemy_shooter', 24, 24); g.clear();
    g.fillStyle(0x9ca3af); g.fillRect(0, 0, 26, 26); g.generateTexture('enemy_tank', 26, 26); g.clear();
    g.fillStyle(0xfbbf24); g.fillRect(0, 0, 18, 18); g.generateTexture('enemy_exploder', 18, 18); g.clear();
    g.fillStyle(0x7f1d1d); g.fillRect(0, 0, 28, 28); g.fillRect(8, 8, 12, 12); g.generateTexture('enemy_brute', 30, 30); g.clear();
    g.fillStyle(0x2563eb); g.fillRect(0, 0, 22, 26); g.fillRect(4, 8, 14, 10); g.generateTexture('enemy_mage', 24, 28); g.clear();
    g.fillStyle(0x60a5fa); g.fillRect(0, 0, 12, 12); g.generateTexture('projectile_blue', 12, 12); g.clear();
    g.fillStyle(0xf97316); g.fillRect(0, 0, 14, 14); g.generateTexture('projectile_orange', 14, 14); g.clear();
    g.fillStyle(0x22d3ee); g.fillRect(0, 0, 10, 10); g.generateTexture('projectile_cyan', 10, 10); g.clear();
    g.fillStyle(0xff0000); g.fillRect(0, 0, 12, 12); g.generateTexture('enemyProjectile', 12, 12); g.clear();
    g.fillStyle(0xffffff); g.fillCircle(4, 4, 4); g.generateTexture('fx_spark', 8, 8); g.clear();
    g.fillStyle(0xfacc15); g.fillCircle(6, 6, 6); g.generateTexture('fx_glow', 12, 12); g.clear();
    g.fillStyle(0x93c5fd); g.fillRect(0, 0, 6, 6); g.generateTexture('fx_trail', 8, 8); g.clear();
    g.lineStyle(2, 0xf97316); g.strokeCircle(16, 16, 16); g.generateTexture('aura', 32, 32); g.clear();
    g.fillStyle(0xfacc15); g.fillCircle(8, 8, 8); g.generateTexture('xp', 16, 16); g.clear();
    g.fillStyle(0xa855f7); g.fillRect(0, 0, 20, 14); g.generateTexture('chest', 20, 14); g.clear();
    g.fillStyle(0x1f2937); g.fillRect(0, 0, 64, 64); g.generateTexture('tile', 64, 64); g.clear();
    g.fillStyle(0xb91c1c); g.fillRect(0, 0, 48, 48); g.generateTexture('boss', 48, 48); g.clear();

    this.registry.set('worldSize', WORLD_SIZE);
    this.scene.start('PreloadScene');
  }
}
