import CameraManager from '../core/CameraManager.js';
import EntityFactory from '../core/EntityFactory.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import WaveManager from '../systems/WaveManager.js';
import XPSystem from '../systems/XPSystem.js';
import LevelSystem from '../systems/LevelSystem.js';
import LootSystem from '../systems/LootSystem.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import UpgradeSystem from '../systems/UpgradeSystem.js';
import { STARTING_WEAPON, UI_EVENTS } from '../constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.worldSize = this.registry.get('worldSize');
    this.add.tileSprite(0, 0, this.worldSize, this.worldSize, 'tile').setOrigin(0);
    this.physics.world.setBounds(0, 0, this.worldSize, this.worldSize);
    this.factory = new EntityFactory(this);
    // Guard against missing or failed JSON loads so the scene can continue with defaults rather than throwing
    const balance = this.cache.json.get('balanceData') || { player: { hp: 100, speed: 180, recovery: 0.5, magnet: 120 } };
    const weaponsData = this.cache.json.get('weaponsData') || {};
    const enemiesData = this.cache.json.get('enemiesData') || { types: [], bosses: [] };
    const upgradesData = this.cache.json.get('upgradesData') || { general: [] };
    const wavesData = this.cache.json.get('wavesData') || { waves: [{ time: 0, enemies: [], spawnRate: 1000, spawnCount: 1 }] };

    const startWeapon = this.registry.get('startWeapon') || STARTING_WEAPON;
    this.player = this.factory.createPlayer(this.worldSize / 2, this.worldSize / 2, { ...balance.player, startWeapon });
    this.cameraManager = new CameraManager(this);
    this.cameraManager.follow(this.player);

    this.enemies = this.physics.add.group({ runChildUpdate: true });
    this.projectiles = this.physics.add.group({ runChildUpdate: true, maxSize: 200 });
    this.enemyProjectiles = this.physics.add.group({ runChildUpdate: true, maxSize: 200 });
    this.xpGroup = this.physics.add.group({ runChildUpdate: true });
    this.lootGroup = this.physics.add.group({ runChildUpdate: true });
    this.bossGroup = this.physics.add.group({ runChildUpdate: true });

    this.xpSystem = new XPSystem(this);
    this.levelSystem = new LevelSystem(this);
    this.lootSystem = new LootSystem(this);
    this.collisionSystem = new CollisionSystem(this);
    this.upgradeSystem = new UpgradeSystem(this, upgradesData, weaponsData);
    this.enemySpawner = new EnemySpawner(this, enemiesData);
    this.waveManager = new WaveManager(this, wavesData);

    this.collisionSystem.setup();
    this.elapsed = 0;
    this.spawnTimer = 0;
    this.bossSpawnedAt = 0;
    this.autoMagnet = false;

    this.player.on('died', () => this.endRun());
  }

  update(time, delta) {
    this.elapsed += delta / 1000;
    this.player.update(time, delta);
    this.waveManager.update(delta);
    this.spawnTimer += delta;
    const wave = this.waveManager.getCurrentWave();
    const enemyCap = 450;
    if (wave && this.spawnTimer > (wave.spawnRate || 800) && this.enemies.countActive(true) < enemyCap) {
      this.spawnTimer = 0;
      const enemiesPool = this.waveManager.getCurrentEnemies();
      for (let i = 0; i < (wave.spawnCount || 1); i++) {
        const typeId = Phaser.Utils.Array.GetRandom(enemiesPool);
        const enemy = this.enemySpawner.spawn(typeId);
        enemy.on('killed', (e) => this.onEnemyKilled(e));
      }
    }
    if (this.waveManager.shouldSpawnBoss(this.elapsed) && this.elapsed - this.bossSpawnedAt > 300) {
      this.spawnBoss(wave?.bossId);
      this.bossSpawnedAt = this.elapsed;
    }

    this.bossGroup.children.iterate((boss) => {
      if (boss && boss.updateBoss) {
        boss.updateBoss(time, delta, this.player, this.enemyProjectiles);
      }
    });

    if (this.autoMagnet) this.pullXPOrbs();
  }

  getClosestEnemy(x, y) {
    let closest = null;
    let dist = Infinity;
    this.enemies.children.iterate((enemy) => {
      if (!enemy) return;
      const d = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (d < dist) { dist = d; closest = enemy; }
    });
    return closest;
  }

  getRandomEnemy() {
    return Phaser.Utils.Array.GetRandom(this.enemies.getChildren());
  }

  damageEnemiesInRadius(x, y, radius, damage) {
    this.enemies.children.iterate((enemy) => {
      if (!enemy) return;
      if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
        enemy.takeDamage(damage);
      }
    });
    this.bossGroup.children.iterate((boss) => {
      if (!boss) return;
      if (Phaser.Math.Distance.Between(x, y, boss.x, boss.y) <= radius) {
        boss.takeDamage(damage);
      }
    });
  }

  onEnemyKilled(enemy) {
    const xpAmount = enemy.typeData?.dropXp || Phaser.Math.Between(1, 5);
    this.lootSystem.dropXP(enemy.x, enemy.y, xpAmount);
    if (Math.random() < 0.03) this.lootSystem.dropChest(enemy.x, enemy.y);
  }

  spawnBoss(bossId) {
    if (!bossId) return;
    const enemiesData = this.cache.json.get('enemiesData') || { bosses: [] };
    const bosses = Array.isArray(enemiesData.bosses) ? enemiesData.bosses : [];
    const bossData = bosses.find((b) => b.id === bossId) || bosses[0];
    if (!bossData) return;
    const boss = this.factory.createBoss(this.player.x + 400, this.player.y, bossData);
    boss.on('killed', () => this.handleBossDefeated());
    this.bossGroup.add(boss);
    this.waveManager.markBossSpawned();
    this.events.emit(UI_EVENTS.BOSS_SPAWN, bossData);
  }

  pullXPOrbs() {
    this.xpGroup.children.iterate((orb) => {
      if (!orb || !orb.body) return;
      const dir = new Phaser.Math.Vector2(this.player.x - orb.x, this.player.y - orb.y).normalize();
      orb.body.setVelocity(dir.x * 200, dir.y * 200);
    });
  }

  handleLevelUp(level) {
    this.openUpgradeMenu(1, level);
  }

  showChestReward() {
    this.openUpgradeMenu(1, null, true);
  }

  openUpgradeMenu(picks = 1, level = null, chestReward = false) {
    if (!this.scene.isActive('GameScene')) return;
    this.scene.pause();
    this.scene.launch('LevelUpScene', { level, chestReward, picks });
  }

  endRun() {
    this.scene.stop('UIScene');
    this.scene.start('GameOverScene', { timeSurvived: this.elapsed });
  }

  handleBossDefeated() {
    this.add.text(this.player.x, this.player.y - 50, 'Босс побежден!', { color: '#facc15' }).setScrollFactor(0);
    this.openUpgradeMenu(3, null, false);
  }
}
