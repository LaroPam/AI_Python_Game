import SaveSystem from '../core/SaveSystem.js';
import { FONT_FAMILY } from '../constants.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    this.settings = SaveSystem.loadSettings();
    this.add.text(80, 60, 'Настройки', { fontSize: '36px', fontFamily: FONT_FAMILY, color: '#f8fafc' });
    this.createSlider(80, 120, 'Музыка', 'music');
    this.createSlider(80, 180, 'SFX', 'sfx');
    this.createButton(80, 260, 'Назад', () => {
      SaveSystem.saveSettings(this.settings);
      this.scene.start('MainMenuScene');
    });
  }

  createSlider(x, y, label, key) {
    this.add.text(x, y - 20, label, { fontSize: '18px', fontFamily: FONT_FAMILY, color: '#e5e7eb' });
    const track = this.add.rectangle(x, y, 200, 6, 0x1f2937).setOrigin(0, 0.5);
    const handle = this.add.rectangle(x + this.settings[key] * 200, y, 14, 20, 0x38bdf8).setOrigin(0.5);
    handle.setInteractive({ draggable: true }).on('drag', (pointer, dragX) => {
      const clamped = Phaser.Math.Clamp(dragX, x, x + 200);
      handle.x = clamped;
      this.settings[key] = (clamped - x) / 200;
    });
    this.input.setDraggable(handle);
  }

  createButton(x, y, label, cb) {
    const btn = this.add.rectangle(x, y, 220, 44, 0x1f2937).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    this.add.text(x + 12, y + 10, label, { fontSize: '20px', fontFamily: FONT_FAMILY, color: '#fff' });
    btn.on('pointerup', cb);
  }
}
