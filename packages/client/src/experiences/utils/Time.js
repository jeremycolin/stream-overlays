import * as THREE from "three";
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.clock = new THREE.Clock();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.elapsedTime = this.clock.getElapsedTime();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    this.elapsedTime = this.clock.getElapsedTime();

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
