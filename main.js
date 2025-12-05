// Dynamically load Phaser then bootstrap the game configuration
const phaserScript = document.createElement('script');
phaserScript.src = 'https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.js';
phaserScript.onload = async () => {
  const { gameConfig } = await import('./src/config.js');
  // eslint-disable-next-line no-undef
  new Phaser.Game({ ...gameConfig, parent: 'game-container' });
};
document.head.appendChild(phaserScript);
