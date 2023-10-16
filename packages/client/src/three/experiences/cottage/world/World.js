import Experience from "../Experience";
import Environment from "./Environment";
import Loader from "./Loader";
import Cottage from "./Cottage";
import Smoke from "./Smoke";
import Stars from "./Stars";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.loaderOverlay = new Loader();
    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      this.cottage = new Cottage();
      this.smoke = new Smoke();
      this.stars = new Stars();
      this.environment = new Environment();

      // Show Experience
      this.loaderOverlay.hideLoader();
    });
  }

  update() {
    if (this.stars) this.stars.update();
    if (this.smoke) this.smoke.update();
  }
}
