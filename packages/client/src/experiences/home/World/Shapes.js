import * as THREE from "three";
import Experience from "../Experience";

export default class Box {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    // Options
    this.options = {
      nbShapes: 12,
    };
    this.shapes = [];
    this.geometry = new THREE.TetrahedronGeometry(1, 0);
    this.material = new THREE.MeshBasicMaterial({
      wireframe: true,
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Box");
    }

    // Setup
    this.setModels();
  }

  setModels() {
    for (let index = 0; index < this.options.nbShapes; index++) {
      this.addShapes();
    }
  }

  addShapes() {
    const shape = new THREE.Mesh(this.geometry, this.material);
    shape.position.x = (Math.random() - 0.5) * 6;
    shape.position.y = (Math.random() - 0.5) * 12;
    shape.rotationSpeedX = (Math.random() - 0.5) * 0.02; // Random rotation speed for X-axis
    shape.rotationSpeedY = (Math.random() - 0.5) * 0.02; // Random rotation speed for Y-axis
    this.shapes.push(shape);
    this.scene.add(shape);
  }

  update() {
    this.shapes.forEach((shape) => {
      shape.rotation.x += shape.rotationSpeedX;
      shape.rotation.y += shape.rotationSpeedY;
    });
  }
}
