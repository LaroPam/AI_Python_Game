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
      const rarityColors = { common: '#d1d5db', uncommon: '#22c55e', rare: '#3b82f6', epic: '#facc15', legendary: '#a855f7' };
      const desc = up.type === 'weapon'
        ? `${up.name} (ур. ${Math.max(1, (up.level || 0) + 1)})\n${up.upgrade ? Object.keys(up.upgrade).join(', ') : 'Усиление'}`
        : `${up.name}\n${up.description || ''}`;
      const txt = this.scene.add.text(-220 + idx * 220, -90, desc, {
        fontSize: '16px',
        color: rarityColors[up.rarity] || '#e5e7eb',
        wordWrap: { width: 180 },
        lineSpacing: 4
      }).setOrigin(0);
      const badge = this.scene.add.text(txt.x, txt.y - 24, up.rarity ? up.rarity.toUpperCase() : 'Оружие', {
        fontSize: '12px',
        color: rarityColors[up.rarity] || '#f8fafc'
      }).setOrigin(0);
      badge.setInteractive({ useHandCursor: true }).on('pointerup', () => onSelect(up));
      txt.setInteractive({ useHandCursor: true }).on('pointerup', () => onSelect(up));
      this.add([badge, txt]);
      return [badge, txt];
    });
    this.choiceTexts = this.choiceTexts.flat();
  }
}
