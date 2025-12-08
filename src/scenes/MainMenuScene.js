import { FONT_FAMILY } from '../constants.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    this.add.text(100, 80, 'Phaser Survivors', { fontSize: '48px', fontFamily: FONT_FAMILY, color: '#f8fafc' });
    this.add.text(100, 140, 'Вдохновлено Vampire Survivors', { fontSize: '18px', fontFamily: FONT_FAMILY, color: '#cbd5e1' });

    this.selectedWeapon = this.registry.get('startWeapon') || 'magicMissile';
    this.createWeaponSelector(100, 180);

    this.createButton(100, 220, 'Старт', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
    this.createButton(100, 280, 'Настройки', () => this.scene.start('SettingsScene'));
    this.createButton(100, 340, 'Выход', () => window.close());
  }

  createButton(x, y, label, cb) {
    const btn = this.add.rectangle(x, y, 220, 48, 0x1f2937).setOrigin(0, 0);
    btn.setInteractive({ useHandCursor: true }).on('pointerup', cb);
    this.add.text(x + 12, y + 12, label, { fontSize: '20px', fontFamily: FONT_FAMILY, color: '#f8fafc' });
  }

  createWeaponSelector(x, y) {
    const weapons = this.cache.json.get('weaponsData') || {};
    const keys = Object.keys(weapons).slice(0, 4);
    this.add.text(x, y - 18, 'Стартовое оружие', { fontSize: '18px', fontFamily: FONT_FAMILY, color: '#e5e7eb' });
    keys.forEach((id, idx) => {
      const weapon = weapons[id];
      const rect = this.add.rectangle(x + idx * 140, y + 8, 130, 46, 0x111827, 0.7).setOrigin(0);
      const label = this.add.text(rect.x + 8, rect.y + 12, weapon.name || id, {
        fontSize: '14px',
        fontFamily: FONT_FAMILY,
        color: '#f8fafc',
        wordWrap: { width: rect.width - 16 }
      });
      const select = () => {
        this.selectedWeapon = id;
        this.registry.set('startWeapon', id);
        this.selectionOutline?.destroy();
        this.selectionOutline = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x22c55e, 0).setOrigin(0);
        this.selectionOutline.setStrokeStyle(2, 0x22c55e);
      };
      rect.setInteractive({ useHandCursor: true }).on('pointerup', select);
      label.setInteractive({ useHandCursor: true }).on('pointerup', select);
      if (id === this.selectedWeapon) select();
    });
  }
}
