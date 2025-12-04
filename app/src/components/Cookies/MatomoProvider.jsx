"use client";

import { useEffect } from "react";

export default function MatomoProvider() {
  useEffect(() => {
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://cdn.matomo.cloud/pineaperiodical.matomo.cloud/container_eZ5jOU2v.js";
    s.parentNode.insertBefore(g, s);
  }, []);

  return null;
}
