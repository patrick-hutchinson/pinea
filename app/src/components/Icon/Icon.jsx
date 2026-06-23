"use client";

import { useState, useEffect } from "react";

const iconContentCache = new Map();
const iconRequestCache = new Map();

const Icon = ({ path, className, onClick }) => {
  const [content, setContent] = useState(() => iconContentCache.get(path) || "");

  useEffect(() => {
    let isMounted = true;

    const cachedContent = iconContentCache.get(path);
    if (cachedContent) {
      setContent(cachedContent);
      return () => {
        isMounted = false;
      };
    }

    let request = iconRequestCache.get(path);

    if (!request) {
      request = fetch(path)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load icon: ${path} (${res.status})`);
          }
          return res.text();
        })
        .then((svg) => {
          iconContentCache.set(path, svg);
          iconRequestCache.delete(path);
          return svg;
        })
        .catch((error) => {
          iconRequestCache.delete(path);
          throw error;
        });

      iconRequestCache.set(path, request);
    }

    request
      .then((svg) => {
        if (isMounted) setContent(svg);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setContent("");
      });

    return () => {
      isMounted = false;
    };
  }, [path]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: content }} onClick={onClick} />;
};

export default Icon;
