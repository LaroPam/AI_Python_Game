import SaveSystem from '../core/SaveSystem.js';

const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Use HTML5 Audio (asAudioBuffer: false) to avoid WebAudio decode errors when
    // loading tiny data-URI placeholders. This prevents BaseAudioContext.decodeAudioData
    // from receiving undefined buffers and stalling the loader.
    const audioConfig = { asAudioBuffer: false };
    this.load.audio('music_menu', SILENCE, audioConfig);
    this.load.audio('music_game', SILENCE, audioConfig);
    this.load.audio('music_boss', SILENCE, audioConfig);
    this.load.audio('sfx_hit', SILENCE, audioConfig);
    this.load.audio('sfx_xp', SILENCE, audioConfig);
    this.load.audio('sfx_chest', SILENCE, audioConfig);

    this.add.text(20, 20, 'Загрузка...', { fontSize: '24px', color: '#fff' });
  }

  create() {
    const settings = SaveSystem.loadSettings();
    this.registry.set('settings', settings);
    this.scene.start('MainMenuScene');
  }
}
