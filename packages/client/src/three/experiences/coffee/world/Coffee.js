import * as THREE from "three";
import { gsap } from "gsap";

import Experience from "../Experience";

export default class Cottage {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Options
    this.options = {};

    // Setup
    this.resource = this.resources.items.coffeeModel;
    this.tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    this.setDebug();
    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    this.model.rotation.x = Math.PI / 12;
    this.model.rotation.y = Math.PI / 12;
    this.scene.add(this.model);
  }

  setAnimation() {
    this.tl.fromTo(this.model.position, { y: 7 }, { y: 0, duration: 1.5, ease: "power3.inOut" });
    this.tl.fromTo(this.model.position, { y: 0 }, { y: -7, duration: 1.5, ease: "power3.inOut" }, "+=5");
  }

  setDebug() {
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Coffee");
    }
  }

  update() {}
}
