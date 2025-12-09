import { UI_EVENTS } from '../constants.js';

export default class WaveManager {
  constructor(scene, wavesData) {
    this.scene = scene;
    const safeWaves = Array.isArray(wavesData?.waves) ? wavesData.waves : [{ time: 0, enemies: [], spawnRate: 1000, spawnCount: 1 }];
    this.waves = safeWaves;
    this.currentWaveIndex = 0;
    this.elapsed = 0;
    this.bossSpawned = false;
  }

  update(delta) {
    this.elapsed += delta / 1000;
    const nextWave = this.waves[this.currentWaveIndex + 1];
    if (nextWave && this.elapsed >= nextWave.time) {
      this.currentWaveIndex++;
      this.bossSpawned = false;
      this.scene.events.emit(UI_EVENTS.NEW_WAVE, this.waves[this.currentWaveIndex]);
    }
  }

  getCurrentEnemies() {
    return this.waves[this.currentWaveIndex].enemies;
  }

  getCurrentWave() {
    return this.waves[this.currentWaveIndex];
  }

  getDifficultyScale() {
    const timeScale = 1 + (this.elapsed / 90) * 0.35;
    return (1 + this.currentWaveIndex * 0.55) * timeScale;
  }

  shouldSpawnBoss(elapsed) {
    const wave = this.waves[this.currentWaveIndex];
    return wave.boss === true && !this.bossSpawned && elapsed >= wave.time;
  }

  markBossSpawned() {
    this.bossSpawned = true;
  }
}
