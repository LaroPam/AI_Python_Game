import { UI_EVENTS } from '../constants.js';

export default class WaveManager {
  constructor(scene, wavesData) {
    this.scene = scene;
    this.waves = wavesData.waves;
    this.currentWaveIndex = 0;
    this.elapsed = 0;
  }

  update(delta) {
    this.elapsed += delta / 1000;
    const nextWave = this.waves[this.currentWaveIndex + 1];
    if (nextWave && this.elapsed >= nextWave.time) {
      this.currentWaveIndex++;
      this.scene.events.emit(UI_EVENTS.NEW_WAVE, this.waves[this.currentWaveIndex]);
    }
  }

  getCurrentEnemies() {
    return this.waves[this.currentWaveIndex].enemies;
  }

  shouldSpawnBoss() {
    const wave = this.waves[this.currentWaveIndex];
    return wave.boss === true;
  }
}
