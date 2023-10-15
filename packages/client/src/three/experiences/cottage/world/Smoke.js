import * as THREE from "three";
import { gsap } from "gsap";
import Experience from "../Experience";

export default class Smoke {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.controls = this.experience.camera.controls;
    this.resources = this.experience.resources;

    // Options
    this.options = {
      smokeColor: "#282424",
      x: -0.35,
      y: 3.05,
      z: -1.05,
      frequency: 350,
      threshold: 0.011,
    };

    this.animated = false;

    // Setup
    this.meshes = [];

    this.setDebug();
    this.setAudio();
    this.setGeometry();
    this.setMaterial();

    // Start Animation

    this.playAudio();
  }

  setAudio() {
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    // create a global audio source
    this.sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    this.sound.setBuffer(this.resources.items.audio);
    this.sound.setLoop(true);
    this.sound.setVolume(0.5);

    // create an AudioAnalyser, passing in the sound and desired fftSize
    this.analyser = new THREE.AudioAnalyser(this.sound, 32);
  }

  playAudio() {
    this.sound.play();
    setTimeout(() => {
      this.controls.autoRotate = true;
    }, 4000);
  }

  pauseAudio() {
    this.controls.autoRotate = false;
    this.sound.pause();
  }

  setGeometry() {
    this.geometry = new THREE.IcosahedronGeometry(0.1, 0);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: this.options.smokeColor,
      transparent: true,
    });
  }

  createSmokeCloud(intensity) {
    this.animated = true;
    setTimeout(() => {
      this.animated = false;
    }, this.options.frequency);

    const smoke = new THREE.Mesh(this.geometry, this.material.clone());

    smoke.rotation.x = Math.random() * Math.PI * 2;
    smoke.rotation.y = Math.random() * Math.PI * 2;

    smoke.material.opacity = 0;

    this.scene.add(smoke);

    // define random numbers for scaling and position
    const scaleTo = intensity * 2 * 10 * 2.5 + 1;
    const yTo = 5;

    // animate the smoke using GSAP
    const tl = gsap.timeline({
      onComplete: () => {
        this.scene.remove(smoke);
      },
    });
    tl.fromTo(
      smoke.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        duration: 1,
        onStart: () => {
          smoke.position.x = this.options.x;
          smoke.position.y = this.options.y;
          smoke.position.z = this.options.z;
          smoke.material.opacity = 1;
        },
      }
    )
      .fromTo(smoke.position, { y: this.options.y }, { y: yTo, duration: 3 }, "-=1")
      .to(
        smoke.material,
        {
          opacity: 0,
          duration: 1,
        },
        "-=1"
      );
  }

  setDebug() {
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Smoke");
      this.debugFolder
        .addColor(this.options, "smokeColor")
        .name("Smoke Color")
        .onChange(() => {
          this.material.color.set(this.options.smokeColor);
        });
      this.debugFolder.add(this.options, "frequency").min(50).max(1000).step(1).name("Smoke Frequency");
      this.debugFolder.add(this.options, "threshold").min(0.005).max(0.02).step(0.0001).name("Audio Threshold");
    }
  }

  update() {
    let analysis = Math.pow((this.analyser.getFrequencyData()[2] / 255) * 0.85, 8);
    if (analysis > this.options.threshold && !this.animated) {
      this.createSmokeCloud(analysis);
    }
  }
}
