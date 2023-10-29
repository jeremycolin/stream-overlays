import * as THREE from "three";

import Sizes from "@/three/utils/Sizes.js";
import Time from "@/three/utils/Time.js";
import Resources from "@/three/utils/Resources.js";
import Debug from "@/three/utils/Debug.js";
import Stats from "@/three/utils/Stats.js";

import Camera from "./Camera.js";
import Renderer from "./Renderer.js";

import World from "./world/World.js";

import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(options) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = options.canvas;

    // Setup
    this.debug = new Debug();
    this.stats = new Stats();
    this.sizes = new Sizes(options.resize);
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();

    // World
    this.world = new World();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.stats.begin();
    this.camera.update();
    this.world.update();
    this.renderer.update();
    this.stats.end();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
