import * as THREE from "three";
import Experience from "../Experience";

import vertexShader from "@/three/shaders/stars/vertex.glsl";
import fragmentShader from "@/three/shaders/stars/fragment.glsl";

export default class Stars {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    // Options
    this.options = {
      starsCount: 200,
    };

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.positionArray = new Float32Array(this.options.starsCount * 3);
    this.scaleArray = new Float32Array(this.options.starsCount * 1);

    for (let i = 0; i < this.options.starsCount; i++) {
      this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 10;
      this.positionArray[i * 3 + 1] = Math.random() * 10;
      this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10;

      this.scaleArray[i] = Math.random();
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positionArray, 3));
    this.geometry.setAttribute("aScale", new THREE.BufferAttribute(this.scaleArray, 1));
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.position.y = -5;
    this.scene.add(this.points);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsedTime;
  }
}
