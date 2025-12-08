import LevelUpMenu from '../ui/LevelUpMenu.js';

export default class LevelUpScene extends Phaser.Scene {
  constructor() {
    super('LevelUpScene');
  }

  init(data) {
    this.level = data.level || 0;
    this.chestReward = data.chestReward || false;
    this.picks = data.picks || 1;
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7).setOrigin(0);
    this.menu = new LevelUpMenu(this, this.scale.width / 2, this.scale.height / 2);
    this.showOptions();
  }

  showOptions() {
    const options = this.gameScene.upgradeSystem.getRandomOptions(3);
    this.menu.showUpgrades(options, (upgrade) => {
      this.gameScene.upgradeSystem.applyUpgrade(upgrade);
      this.picks -= 1;
      if (this.picks > 0) {
        this.showOptions();
      } else {
        this.scene.stop();
        this.scene.resume('GameScene');
      }
    });
  }
}
