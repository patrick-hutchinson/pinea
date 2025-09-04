import { defineField, defineType } from "sanity";

export const pictureBrush = defineType({
  name: "pictureBrush",
  title: "Picture Brush",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    }),
  ],
});
