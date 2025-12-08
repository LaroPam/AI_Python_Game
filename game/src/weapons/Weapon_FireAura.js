import WeaponBase from './WeaponBase.js';

export default class WeaponFireAura extends WeaponBase {
  constructor(scene, owner, config) {
    super(scene, owner, config);
    this.aura = scene.add.circle(owner.x, owner.y, config.radius, 0xf97316, 0.3);
    scene.physics.add.existing(this.aura);
    this.aura.body.setAllowGravity(false);
    this.tickTimer = 0;
  }

  update(time, delta) {
    this.aura.setPosition(this.owner.x, this.owner.y);
    this.tickTimer += delta;
    if (this.tickTimer >= Math.max(200, this.config.tickRate)) {
      this.tickTimer = 0;
      this.scene.damageEnemiesInRadius(this.owner.x, this.owner.y, this.config.radius, this.config.damage);
    }
  }
}
