export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.settings = { music: 0.5, sfx: 0.7 };
  }

  applySettings(settings) {
    this.settings = settings;
    this.scene.sound.volume = settings.sfx;
    if (this.music) this.music.setVolume(settings.music);
  }

  playMusic(key, config = {}) {
    if (this.music) {
      this.music.stop();
    }
    this.music = this.scene.sound.add(key, { loop: true, volume: this.settings.music, ...config });
    this.music.play();
  }

  playSFX(key, config = {}) {
    const sfx = this.scene.sound.add(key, { volume: this.settings.sfx, ...config });
    sfx.play();
    return sfx;
  }
}
