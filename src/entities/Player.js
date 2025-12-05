import { STARTING_WEAPON } from '../constants.js';
import InputManager from '../core/InputManager.js';
import WeaponMagicMissile from '../weapons/Weapon_MagicMissile.js';
import WeaponFireAura from '../weapons/Weapon_FireAura.js';
import WeaponLightning from '../weapons/Weapon_LightningStrike.js';
import WeaponBoomerang from '../weapons/Weapon_Boomerang.js';
import WeaponOrbit from '../weapons/Weapon_OrbitingBlades.js';

const WEAPON_CLASSES = {
  magicMissile: WeaponMagicMissile,
  fireAura: WeaponFireAura,
  lightning: WeaponLightning,
  boomerang: WeaponBoomerang,
  orbit: WeaponOrbit
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setCircle(12, 4, 4);

    this.stats = {
      maxHealth: config.hp,
      health: config.hp,
      speed: config.speed,
      recovery: config.recovery,
      magnetRadius: config.magnet,
      armor: 0,
      attackSpeedBonus: 0
    };

    this.inputManager = new InputManager(scene);
    this.weapons = [];
    this.lastHit = 0;
    this.invuln = 800;
    this.addWeapon(STARTING_WEAPON, scene.cache.json.get('weaponsData')[STARTING_WEAPON]);
  }

  addWeapon(id, data) {
    const Cls = WEAPON_CLASSES[id];
    if (Cls) {
      const weapon = new Cls(this.scene, this, data);
      this.weapons.push(weapon);
    }
  }

  heal(delta) {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + this.stats.recovery * (delta / 1000));
  }

  takeDamage(amount) {
    const now = this.scene.time.now;
    if (now - this.lastHit < this.invuln) return;
    this.lastHit = now;
    const dmg = Math.max(1, amount - this.stats.armor);
    this.stats.health -= dmg;
    if (this.stats.health <= 0) {
      this.emit('died');
    }
  }

  update(time, delta) {
    const dir = this.inputManager.getDirection();
    this.body.setVelocity(dir.x * this.stats.speed, dir.y * this.stats.speed);
    this.body.velocity.normalize().scale(this.stats.speed);
    this.heal(delta);
    this.weapons.forEach((w) => w.update(time, delta));
  }
}
