import SaveSystem from '../core/SaveSystem.js';

const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.audio('music_menu', SILENCE);
    this.load.audio('music_game', SILENCE);
    this.load.audio('music_boss', SILENCE);
    this.load.audio('sfx_hit', SILENCE);
    this.load.audio('sfx_xp', SILENCE);
    this.load.audio('sfx_chest', SILENCE);

    this.add.text(20, 20, 'Загрузка...', { fontSize: '24px', color: '#fff' });
  }

  create() {
    const settings = SaveSystem.loadSettings();
    this.registry.set('settings', settings);
    this.scene.start('MainMenuScene');
  }
}
