const keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1 };

const preventDefault = (e) => e.preventDefault();

const preventDefaultForScrollKeys = (e) => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
};

const supportsPassive = (() => {
  let passiveSupported = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get() {
          passiveSupported = true;
          return true;
        },
      })
    );
  } catch (_) {
    // ignore errors
  }
  return passiveSupported;
})();

const options = supportsPassive ? { passive: false } : false;

export const disableScroll = () => {
  window.addEventListener("DOMMouseScroll", preventDefault, false);
  window.addEventListener("wheel", preventDefault, options);
  window.addEventListener("touchmove", preventDefault, options);
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
};

export const enableScroll = () => {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener("wheel", preventDefault, options);
  window.removeEventListener("touchmove", preventDefault, options);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
};
