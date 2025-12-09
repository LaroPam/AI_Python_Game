export default class FXManager {
  constructor(scene) {
    this.scene = scene;
    this.sparkParticles = scene.add.particles('fx_spark');
    this.glowParticles = scene.add.particles('fx_glow');
    this.trailParticles = scene.add.particles('fx_trail');

    this.sparkParticles.setDepth(20);
    this.glowParticles.setDepth(19);
    this.trailParticles.setDepth(18);

    this.hitEmitter = this.sparkParticles.createEmitter({
      on: false,
      speed: { min: 140, max: 260 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 420,
      blendMode: 'ADD'
    });

    this.softEmitter = this.glowParticles.createEmitter({
      on: false,
      speed: { min: 60, max: 140 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 520,
      blendMode: 'ADD'
    });

    this.shockEmitter = this.glowParticles.createEmitter({
      on: false,
      speed: { min: 90, max: 220 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.1, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 460,
      blendMode: 'SCREEN'
    });
  }

  impact(x, y, color = 0xffffff, amount = 14) {
    this.hitEmitter.setTint(color);
    this.hitEmitter.explode(amount, x, y);
  }

  burst(x, y, color = 0xffffff, amount = 10) {
    this.softEmitter.setTint(color);
    this.softEmitter.explode(amount, x, y);
  }

  shockwave(x, y, color = 0xffffff, amount = 18) {
    this.shockEmitter.setTint(color);
    this.shockEmitter.explode(amount, x, y);
  }

  attachProjectileTrail(target, tint = 0xffffff) {
    const emitter = this.trailParticles.createEmitter({
      follow: target,
      speed: { min: 10, max: 60 },
      lifespan: 480,
      scale: { start: 0.45, end: 0 },
      alpha: { start: 0.9, end: 0 },
      frequency: 35,
      tint,
      blendMode: 'ADD'
    });
    target.once('destroy', () => this.stopEmitter(emitter));
    return emitter;
  }

  muzzleFlash(x, y, color = 0xffffff) {
    const circle = this.scene.add.circle(x, y, 10, color, 0.85).setDepth(21);
    this.scene.tweens.add({ targets: circle, alpha: 0, scale: 0, duration: 120, ease: 'sine.out', onComplete: () => circle.destroy() });
  }

  stopEmitter(emitter) {
    if (!emitter) return;
    emitter.stop();
    this.scene.time.delayedCall(400, () => emitter.remove());
  }

  destroy() {
    this.sparkParticles.destroy();
    this.glowParticles.destroy();
    this.trailParticles.destroy();
  }
}
