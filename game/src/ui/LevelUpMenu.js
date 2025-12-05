export default class LevelUpMenu extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.bg = scene.add.rectangle(0, 0, 480, 300, 0x0f172a, 0.94).setOrigin(0.5);
    this.title = scene.add.text(0, -120, 'Выберите улучшение', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    this.choiceTexts = [];
    this.add([this.bg, this.title]);
    scene.add.existing(this);
  }

  showUpgrades(upgrades, onSelect) {
    this.remove(this.choiceTexts, true);
    this.choiceTexts = upgrades.map((up, idx) => {
      const txt = this.scene.add.text(-200 + idx * 200, -40, up.name, { fontSize: '18px', color: up.type === 'rare' ? '#facc15' : '#e5e7eb', wordWrap: { width: 160 } }).setOrigin(0);
      txt.setInteractive({ useHandCursor: true }).on('pointerup', () => onSelect(up));
      this.add(txt);
      return txt;
    });
  }
}
