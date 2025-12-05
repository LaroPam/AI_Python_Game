import { WORLD_SIZE } from '../constants.js';

export default class CameraManager {
  constructor(scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.camera.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    this.camera.setZoom(0.8);
  }

  follow(target) {
    this.camera.startFollow(target, true, 0.1, 0.1);
  }
}
