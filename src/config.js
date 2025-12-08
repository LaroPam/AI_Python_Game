import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import UIScene from './scenes/UIScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import LevelUpScene from './scenes/LevelUpScene.js';
import SettingsScene from './scenes/SettingsScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0d0d13',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
      fps: 60
    }
  },
  audio: {
    // Disable audio to avoid placeholder decode/load errors when no assets are present
    noAudio: true,
    disableWebAudio: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    GameScene,
    UIScene,
    PauseScene,
    LevelUpScene,
    GameOverScene,
    SettingsScene
  ]
};
