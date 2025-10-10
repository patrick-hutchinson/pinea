"use client";

import { useState, useEffect } from "react";

const Icon = ({ path, className }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then(setContent)
      .catch(console.error);
  }, [path]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Icon;
