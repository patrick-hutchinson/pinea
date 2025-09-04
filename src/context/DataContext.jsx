"use client";

import { client } from "../sanity/lib/client";

import { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [pictureBrushData, setPictureBrushData] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type=="pictureBrush"][0]{
  images[]{
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
}`
      )
      .then((data) => setPictureBrushData(data))
      .catch(console.error);
  }, []);

  return <DataContext.Provider value={{ pictureBrushData }}>{children}</DataContext.Provider>;
};
