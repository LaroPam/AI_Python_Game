import { STORAGE_KEYS } from '../constants.js';

export default class SaveSystem {
  static load(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Save parse error', e);
      return null;
    }
  }

  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static loadSettings() {
    return this.load(STORAGE_KEYS.settings) || { music: 0.5, sfx: 0.7, quality: 'high', language: 'ru' };
  }

  static saveSettings(settings) {
    this.save(STORAGE_KEYS.settings, settings);
  }

  static loadProgress() {
    return this.load(STORAGE_KEYS.progress) || { bestTime: 0, unlockedWeapons: ['magicMissile'] };
  }

  static saveProgress(progress) {
    this.save(STORAGE_KEYS.progress, progress);
  }
}
