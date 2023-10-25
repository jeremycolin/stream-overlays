import Experience from "../Experience";
import Environment from "./Environment";
import Coffee from "./Coffee";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      this.coffee = new Coffee();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.coffee) this.coffee.update();
  }
}
