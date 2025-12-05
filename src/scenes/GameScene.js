import CameraManager from '../core/CameraManager.js';
import EntityFactory from '../core/EntityFactory.js';
import EnemySpawner from '../systems/EnemySpawner.js';
import WaveManager from '../systems/WaveManager.js';
import XPSystem from '../systems/XPSystem.js';
import LevelSystem from '../systems/LevelSystem.js';
import LootSystem from '../systems/LootSystem.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import UpgradeSystem from '../systems/UpgradeSystem.js';
import { UI_EVENTS } from '../constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.worldSize = this.registry.get('worldSize');
    this.add.tileSprite(0, 0, this.worldSize, this.worldSize, 'tile').setOrigin(0);
    this.physics.world.setBounds(0, 0, this.worldSize, this.worldSize);
    this.factory = new EntityFactory(this);
    const balance = this.cache.json.get('balanceData');
    this.player = this.factory.createPlayer(this.worldSize / 2, this.worldSize / 2, balance.player);
    this.cameraManager = new CameraManager(this);
    this.cameraManager.follow(this.player);

    this.enemies = this.physics.add.group({ runChildUpdate: true });
    this.projectiles = this.physics.add.group({ runChildUpdate: true });
    this.xpGroup = this.physics.add.group({ runChildUpdate: true });
    this.lootGroup = this.physics.add.group({ runChildUpdate: true });
    this.bossGroup = this.physics.add.group({ runChildUpdate: true });

    this.xpSystem = new XPSystem(this);
    this.levelSystem = new LevelSystem(this);
    this.lootSystem = new LootSystem(this);
    this.collisionSystem = new CollisionSystem(this);
    this.upgradeSystem = new UpgradeSystem(this, this.cache.json.get('upgradesData'));
    this.enemySpawner = new EnemySpawner(this, this.cache.json.get('enemiesData'));
    this.waveManager = new WaveManager(this, this.cache.json.get('wavesData'));

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
    const enemiesPool = this.waveManager.getCurrentEnemies();
    if (this.spawnTimer > 800) {
      this.spawnTimer = 0;
      const typeId = Phaser.Utils.Array.GetRandom(enemiesPool);
      const enemy = this.enemySpawner.spawn(typeId);
      enemy.on('killed', (e) => this.onEnemyKilled(e));
    }
    if (this.waveManager.shouldSpawnBoss() && this.elapsed - this.bossSpawnedAt > 300) {
      this.spawnBoss();
      this.bossSpawnedAt = this.elapsed;
    }
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.body) return;
      const dir = new Phaser.Math.Vector2(this.player.x - enemy.x, this.player.y - enemy.y).normalize();
      enemy.body.setVelocity(dir.x * enemy.speed, dir.y * enemy.speed);
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
    const xpAmount = Phaser.Math.Between(1, 5);
    this.lootSystem.dropXP(enemy.x, enemy.y, xpAmount);
    if (Math.random() < 0.03) this.lootSystem.dropChest(enemy.x, enemy.y);
  }

  spawnBoss() {
    const bossData = this.cache.json.get('enemiesData').boss;
    const boss = this.factory.createBoss(this.player.x + 400, this.player.y, bossData);
    boss.on('killed', () => this.showBossDefeated());
    this.bossGroup.add(boss);
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
    this.scene.pause();
    this.scene.launch('LevelUpScene', { level });
  }

  showChestReward() {
    this.scene.pause();
    this.scene.launch('LevelUpScene', { chestReward: true });
  }

  endRun() {
    this.scene.stop('UIScene');
    this.scene.start('GameOverScene', { timeSurvived: this.elapsed });
  }

  showBossDefeated() {
    this.add.text(this.player.x, this.player.y - 50, 'Босс побежден!', { color: '#facc15' }).setScrollFactor(0);
  }
}
