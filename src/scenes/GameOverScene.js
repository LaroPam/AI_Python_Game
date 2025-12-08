import { FONT_FAMILY } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.timeSurvived = data.timeSurvived || 0;
  }

  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8).setOrigin(0);
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, 'Игра окончена', {
      fontSize: '40px',
      fontFamily: FONT_FAMILY,
      color: '#f8fafc'
    }).setOrigin(0.5);
    this.add.text(this.scale.width / 2, this.scale.height / 2, `Время: ${Math.floor(this.timeSurvived)} сек`, {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#e5e7eb'
    }).setOrigin(0.5);
    const btn = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 60, 220, 48, 0x1f2937).setInteractive({ useHandCursor: true });
    this.add.text(btn.x - 60, btn.y - 12, 'В меню', { fontSize: '20px', fontFamily: FONT_FAMILY, color: '#fff' });
    btn.on('pointerup', () => {
      this.scene.stop('GameScene');
      this.scene.stop('UIScene');
      this.scene.start('MainMenuScene');
    });
  }
}
