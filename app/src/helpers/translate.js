import { useContext } from "react";

import { StateContext } from "@/context/StateContext";

export function translate(object) {
  const { language } = useContext(StateContext);

  let translation = object.find((item) => item._key === language);

  return translation.value;
}
