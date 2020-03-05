import Stats from "stats.js";
export function initStats() {
  if (process.env.NODE_ENV === "development") {
    const state = new Stats();
    state.setMode(0);
    state.domElement.style.position = "absolute";
    state.domElement.style.left = "inherit";
    state.domElement.style.bottom = "0";
    state.domElement.style.right = "0px";
    state.domElement.style.top = "inherit";
    state.domElement.style.width = "100px";
    state.domElement.style.zIndex = 999999;
    document.body.appendChild(state.domElement);
    requestAnimationFrame(function loop() {
      state.update();
      requestAnimationFrame(loop);
    });
  }
}
