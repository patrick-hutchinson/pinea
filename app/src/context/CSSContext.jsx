"use client";

import { createContext, useState, useEffect } from "react";

export const CSSContext = createContext();

export const CSSProvider = ({ children }) => {
  const [values, setValues] = useState({
    line_height_4: 0,
    line_height_3: 0,
    caption_gap: 0,
    filter_height: 0,
    header_height: 0,
    margin: 0,
  });

  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);

    const parse = (v) => parseFloat(v);

    setValues({
      line_height_4: parse(style.getPropertyValue("--line-height-4")),
      line_height_3: parse(style.getPropertyValue("--line-height-3")),
      caption_gap: parse(style.getPropertyValue("--caption-gap")),
      filter_height: parse(style.getPropertyValue("--filter-height")),
      header_height: parse(style.getPropertyValue("--header-height")),
      margin: parse(style.getPropertyValue("--margin")),
    });
  }, []);

  return <CSSContext.Provider value={values}>{children}</CSSContext.Provider>;
};
