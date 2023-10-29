import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  constructor(resize) {
    super();

    // Setup
    this.resize = resize;
    this.width = this.resize ? window.innerWidth : 1920;
    this.height = this.resize ? window.innerHeight : 1080;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    if (this.resize) {
      window.addEventListener("resize", () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.trigger("resize");
      });
    }
  }
}
