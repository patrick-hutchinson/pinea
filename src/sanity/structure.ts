import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton About Page
      S.listItem().title("Picture Brush").child(S.document().schemaType("pictureBrush").documentId("pictureBrush")),

      // Everything else (exclude singleton types from default list)
      ...S.documentTypeListItems().filter((listItem) => !["pictureBrush"].includes(listItem.getId()!)),
    ]);
