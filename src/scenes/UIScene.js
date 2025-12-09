import HealthBar from '../ui/HealthBar.js';
import XPBar from '../ui/XPBar.js';
import MiniMap from '../ui/MiniMap.js';
import FloatingText from '../ui/FloatingText.js';
import { FONT_FAMILY, UI_EVENTS } from '../constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    this.healthBar = new HealthBar(this, 20, 32);
    this.xpBar = new XPBar(this, 20, 66);
    this.timerText = this.add.text(20, 100, '0:00', { fontSize: '16px', fontFamily: FONT_FAMILY, color: '#f8fafc' });
    this.waveText = this.add.text(20, 126, 'Волна 1', { fontSize: '16px', fontFamily: FONT_FAMILY, color: '#38bdf8' });
    this.miniMap = new MiniMap(this, this.scale.width - 180, 20);
    this.floatText = new FloatingText(this);

    const statsY = 210;
    this.statsBg = this.add.rectangle(this.scale.width - 240, statsY, 220, 360, 0x0f172a, 0.82).setOrigin(0);
    this.statsTitle = this.add.text(this.scale.width - 230, statsY + 12, 'Статы', {
      fontSize: '16px',
      fontFamily: FONT_FAMILY,
      color: '#e5e7eb'
    });
    this.statsText = this.add.text(this.scale.width - 230, statsY + 40, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: '#cbd5e1',
      lineSpacing: 6
    });
    this.weaponText = this.add.text(this.scale.width - 230, statsY + 180, '', {
      fontSize: '13px',
      fontFamily: FONT_FAMILY,
      color: '#e0f2fe',
      lineSpacing: 6
    });

    this.gameScene.events.on(UI_EVENTS.NEW_WAVE, (wave) => {
      this.waveText.setText(`Новая волна: ${wave.enemies.join(', ')}`);
      this.floatText.show(this.scale.width / 2, 60, 'Новая волна!', '#facc15');
    });
    this.gameScene.events.on(UI_EVENTS.BOSS_SPAWN, () => {
      this.floatText.show(this.scale.width / 2, 80, 'Босс появился!', '#ef4444');
    });

    this.gameScene.events.on(UI_EVENTS.DAMAGE_NUMBER, ({ x, y, amount }) => {
      const cam = this.gameScene.cameras.main;
      const sx = x - cam.worldView.x;
      const sy = y - cam.worldView.y;
      this.floatText.show(sx, sy, `-${Math.round(amount)}`, '#f87171');
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

    const stats = player.stats;
    this.statsText.setText(
      `HP: ${stats.health.toFixed(0)} / ${stats.maxHealth}\n` +
      `Скорость: ${Math.round(stats.speed)}\n` +
      `Восстановление: ${stats.recovery.toFixed(2)}/с\n` +
      `Магнит: ${Math.round(stats.magnetRadius)}\n` +
      `Броня: ${stats.armor || 0}\n` +
      `Скорость атаки: ${(stats.attackSpeedBonus * 100).toFixed(0)}%`
    );

    const weaponLines = player.weapons.map((w) => `${w.config.name || w.id} — ур. ${player.weaponLevels[w.id]}`);
    this.weaponText.setText(`Оружие:\n${weaponLines.join('\n')}`);
  }
}
