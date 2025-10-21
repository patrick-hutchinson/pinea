import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

export function translate(object) {
  const { language } = useContext(StateContext);

  if (!object || !Array.isArray(object)) return "";

  const translation = object.find((item) => item._key === language) || object.find((item) => item._key === "en");

  return translation?.value || "";
}
