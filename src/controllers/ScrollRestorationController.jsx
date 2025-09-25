"use client";

import { useEffect } from "react";

export default function ScrollRestorationController() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
      console.log("Scroll restoration set to manual");
    }
  }, []);

  return null; // this component doesn’t render anything
}
