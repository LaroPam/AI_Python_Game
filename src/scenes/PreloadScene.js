import SaveSystem from '../core/SaveSystem.js';
import { FONT_FAMILY } from '../constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.add.text(20, 20, 'Загрузка...', { fontSize: '24px', fontFamily: FONT_FAMILY, color: '#f8fafc' });
  }

  create() {
    const settings = SaveSystem.loadSettings();
    this.registry.set('settings', settings);
    this.scene.start('MainMenuScene');
  }
}
