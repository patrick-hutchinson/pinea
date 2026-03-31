"use client";

import { useState, useEffect } from "react";

const Icon = ({ path, className, onClick }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load icon: ${path} (${res.status})`);
        }
        return res.text();
      })
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
