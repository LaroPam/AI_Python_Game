import { FONT_FAMILY } from '../constants.js';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0);
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Пауза', {
      fontSize: '36px',
      fontFamily: FONT_FAMILY,
      color: '#f8fafc'
    }).setOrigin(0.5);
    this.input.keyboard.once('keydown-P', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }
}
