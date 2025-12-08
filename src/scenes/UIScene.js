import HealthBar from '../ui/HealthBar.js';
import XPBar from '../ui/XPBar.js';
import MiniMap from '../ui/MiniMap.js';
import FloatingText from '../ui/FloatingText.js';
import { UI_EVENTS } from '../constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    this.healthBar = new HealthBar(this, 20, 30);
    this.xpBar = new XPBar(this, 20, 60);
    this.timerText = this.add.text(20, 90, '0:00', { fontSize: '16px', color: '#fff' });
    this.waveText = this.add.text(20, 120, 'Волна 1', { fontSize: '16px', color: '#38bdf8' });
    this.miniMap = new MiniMap(this, this.scale.width - 180, 20);
    this.floatText = new FloatingText(this);

    this.gameScene.events.on(UI_EVENTS.NEW_WAVE, (wave) => {
      this.waveText.setText(`Новая волна: ${wave.enemies.join(', ')}`);
      this.floatText.show(this.scale.width / 2, 60, 'Новая волна!', '#facc15');
    });
    this.gameScene.events.on(UI_EVENTS.BOSS_SPAWN, () => {
      this.floatText.show(this.scale.width / 2, 80, 'Босс появился!', '#ef4444');
    });
  }

  update() {
    const player = this.gameScene.player;
    this.healthBar.updateValue(player.stats.health, player.stats.maxHealth);
    this.xpBar.updateValue(
      this.gameScene.xpSystem.currentXp,
      this.gameScene.xpSystem.nextLevelXp,
      this.gameScene.xpSystem.level
    );
    const t = Math.floor(this.gameScene.elapsed);
    this.timerText.setText(`${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`);
    this.miniMap.updatePosition(player, this.gameScene.worldSize);
  }
}
