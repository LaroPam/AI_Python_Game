export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const WORLD_SIZE = 6000;
export const STARTING_WEAPON = 'magicMissile';
export const RARITY_COLORS = {
  common: '#9ca3af', // gray
  uncommon: '#22c55e', // green
  rare: '#3b82f6', // blue
  epic: '#facc15', // yellow/gold
  legendary: '#a855f7' // purple
};
export const STORAGE_KEYS = {
  settings: 'phaser-survivor-settings',
  progress: 'phaser-survivor-progress',
  highscores: 'phaser-survivor-highscores'
};
export const UI_EVENTS = {
  LEVEL_UP: 'ui:levelUp',
  NEW_WAVE: 'ui:newWave',
  BOSS_SPAWN: 'ui:bossSpawn',
  DAMAGE_NUMBER: 'ui:damage',
  UPDATE_STATS: 'ui:updateStats',
  GAME_OVER: 'ui:gameOver'
};
