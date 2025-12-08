export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    this.add.text(100, 80, 'Phaser Survivors', { fontSize: '48px', color: '#fff' });
    this.add.text(100, 140, 'Вдохновлено Vampire Survivors', { fontSize: '18px', color: '#ccc' });

    this.createButton(100, 220, 'Старт', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
    this.createButton(100, 280, 'Настройки', () => this.scene.start('SettingsScene'));
    this.createButton(100, 340, 'Выход', () => window.close());
  }

  createButton(x, y, label, cb) {
    const btn = this.add.rectangle(x, y, 220, 48, 0x1f2937).setOrigin(0, 0);
    btn.setInteractive({ useHandCursor: true }).on('pointerup', cb);
    this.add.text(x + 12, y + 12, label, { fontSize: '20px', color: '#f8fafc' });
  }
}
