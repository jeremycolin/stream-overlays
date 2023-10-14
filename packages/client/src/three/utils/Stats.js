import Stats from "stats.js";

export default class Performance {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
    }
  }

  begin() {
    if (this.active) this.stats.begin();
  }

  end() {
    if (this.active) this.stats.end();
  }
}
