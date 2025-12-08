import { STARTING_WEAPON } from '../constants.js';
import InputManager from '../core/InputManager.js';
import WeaponMagicMissile from '../weapons/Weapon_MagicMissile.js';
import WeaponFireAura from '../weapons/Weapon_FireAura.js';
import WeaponLightning from '../weapons/Weapon_LightningStrike.js';
import WeaponBoomerang from '../weapons/Weapon_Boomerang.js';
import WeaponOrbit from '../weapons/Weapon_OrbitingBlades.js';
import WeaponSword from '../weapons/Weapon_Sword.js';
import WeaponCrossbow from '../weapons/Weapon_Crossbow.js';
import WeaponFireStaff from '../weapons/Weapon_FireStaff.js';

const WEAPON_CLASSES = {
  magicMissile: WeaponMagicMissile,
  fireAura: WeaponFireAura,
  lightning: WeaponLightning,
  boomerang: WeaponBoomerang,
  orbit: WeaponOrbit,
  sword: WeaponSword,
  crossbow: WeaponCrossbow,
  fireStaff: WeaponFireStaff
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setCircle(12, 4, 4);
    this.body.setImmovable(true);
    this.body.pushable = false;
    this.body.setDamping(false);
    this.body.setDrag(0);

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
    this.weaponLevels = {};
    this.maxWeapons = 3;
    this.lastHit = 0;
    this.invuln = 800;
    this.lastMoveDir = new Phaser.Math.Vector2(1, 0);
    this.lastAimDir = new Phaser.Math.Vector2(1, 0);

    const starter = config.startWeapon || STARTING_WEAPON;
    this.addWeapon(starter, scene.cache.json.get('weaponsData')[starter]);
  }

  addWeapon(id, data) {
    if (!data) return false;
    const existing = this.weapons.find((w) => w.id === id);
    if (existing) {
      const currentLevel = this.weaponLevels[id] || 1;
      if (currentLevel >= 7) return false;
      const nextUpgrade = data.upgrades[currentLevel - 1];
      if (nextUpgrade) existing.applyUpgrade(nextUpgrade);
      this.weaponLevels[id] = currentLevel + 1;
      return true;
    }
    if (this.weapons.length >= this.maxWeapons) return false;
    const Cls = WEAPON_CLASSES[id];
    if (!Cls) return false;
    const config = { ...data };
    delete config.upgrades;
    const weapon = new Cls(this.scene, this, config);
    weapon.id = id;
    this.weaponLevels[id] = 1;
    this.weapons.push(weapon);
    return true;
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
    if (this.scene.fx) this.scene.fx.impact(this.x, this.y, 0xff8a8a, 14);
    if (this.stats.health <= 0) {
      this.emit('died');
    }
  }

  update(time, delta) {
    const dir = this.inputManager.getDirection();
    if (dir.lengthSq() > 0) this.lastMoveDir.copy(dir);

    const aimDir = this.inputManager.getAimDirection(this.x, this.y, this.lastMoveDir);
    if (aimDir.lengthSq() > 0) this.lastAimDir.copy(aimDir);

    const desiredVel = dir.clone().scale(this.stats.speed);
    const currentVel = this.body.velocity.clone();
    currentVel.lerp(desiredVel, 0.22);
    if (currentVel.lengthSq() > this.stats.speed * this.stats.speed) {
      currentVel.normalize().scale(this.stats.speed);
    }
    this.body.setVelocity(currentVel.x, currentVel.y);

    // Give the player a subtle squash-stretch based on speed for visual feedback
    const speedRatio = Phaser.Math.Clamp(currentVel.length() / Math.max(1, this.stats.speed), 0, 1);
    this.setScale(1 + speedRatio * 0.05, 1 - speedRatio * 0.05);
    this.heal(delta);
    this.weapons.forEach((w) => w.update(time, delta));
  }
}
