export default class LevelUpMenu extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.bg = scene.add.rectangle(0, 0, 520, 320, 0x0f172a, 0.94).setOrigin(0.5);
    this.title = scene.add.text(0, -130, 'Выберите улучшение', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    this.choiceTexts = [];
    this.add([this.bg, this.title]);
    scene.add.existing(this);
  }

  showUpgrades(upgrades, onSelect) {
    this.remove(this.choiceTexts, true);
    this.choiceTexts = upgrades.map((up, idx) => {
      const desc = up.type === 'weapon'
        ? `${up.name} (ур. ${Math.max(1, (up.level || 0) + 1)})` + (up.upgrade ? ` +${Object.keys(up.upgrade).join(', ')}` : '')
        : up.name;
      const txt = this.scene.add.text(-220 + idx * 220, -60, desc, {
        fontSize: '18px',
        color: up.type === 'rare' ? '#facc15' : '#e5e7eb',
        wordWrap: { width: 180 }
      }).setOrigin(0);
      txt.setInteractive({ useHandCursor: true }).on('pointerup', () => onSelect(up));
      this.add(txt);
      return txt;
    });
  }
}
