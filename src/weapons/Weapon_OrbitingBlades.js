import WeaponBase from './WeaponBase.js';

export default class WeaponOrbitingBlades extends WeaponBase {
  constructor(scene, owner, config) {
    super(scene, owner, config);
    this.blades = this.scene.add.group();
    this.buildBlades();
    this.angle = 0;
  }

  buildBlades() {
    const desired = (this.config.projectileCount || 3);
    while (this.blades.getLength() < desired) {
      const blade = this.scene.add.rectangle(this.owner.x, this.owner.y, 18, 6, 0xffffff);
      this.blades.add(blade);
    }
  }

  update(time, delta) {
    this.buildBlades();
    this.angle += delta * 0.2;
    const radius = this.config.radius;
    const blades = this.blades.getChildren();
    blades.forEach((blade, index) => {
      const a = this.angle + (Math.PI * 2 * index) / blades.length;
      blade.x = this.owner.x + Math.cos(a) * radius;
      blade.y = this.owner.y + Math.sin(a) * radius;
    });
    if (this.scene && this.scene.enemies) {
      this.scene.damageEnemiesInRadius(this.owner.x, this.owner.y, radius, this.config.damage, true);
    }
  }
}
