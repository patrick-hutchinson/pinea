export const ROUTE_TRANSITION_DURATION = 800;

let transitionFinishTimeout = null;

export const runRouteTransition = (duration = ROUTE_TRANSITION_DURATION) => {
  const root = document.documentElement;

  window.clearTimeout(transitionFinishTimeout);
  root.style.setProperty("--route-transition-duration", `${duration}ms`);
  root.classList.add("is-route-transitioning");

  transitionFinishTimeout = window.setTimeout(() => {
    root.classList.remove("is-route-transitioning");
    root.style.removeProperty("--route-transition-duration");
    window.dispatchEvent(new Event("view-transition-finished"));
  }, duration);
};
