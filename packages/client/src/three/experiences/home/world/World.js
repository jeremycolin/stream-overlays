import Experience from "../Experience";
import Shapes from "./Shapes";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Setup
    this.shapes = new Shapes();
  }

  update() {
    if (this.shapes) this.shapes.update();
  }
}
