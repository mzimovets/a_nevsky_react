// tools.js
import Embed from "@editorjs/embed";

import Raw from "@editorjs/raw";
import Header from "@editorjs/header";

const ColorPlugin = require("editorjs-text-color-plugin");

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  // paragraph: Paragraph,
  embed: Embed,
  raw: Raw,
  header: Header,
  //   tools: {
  //     Color: {
  //       class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
  //       config: {
  //         colorCollections: [
  //           "#EC7878",
  //           "#9C27B0",
  //           "#673AB7",
  //           "#3F51B5",
  //           "#0070FF",
  //           "#03A9F4",
  //           "#00BCD4",
  //           "#4CAF50",
  //           "#8BC34A",
  //           "#CDDC39",
  //           "#FFF",
  //         ],
  //         defaultColor: "#FF1300",
  //         type: "text",
  //         customPicker: true, // add a button to allow selecting any colour
  //       },
  //     },
  //   },
};
