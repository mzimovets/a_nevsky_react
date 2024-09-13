import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";
import React, { useEffect } from "react";
import { Button } from "antd";

const Editor = (props) => {
  const ReactEditorJS = createReactEditorJS();
  const editorCore = React.useRef(null);

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleSave = React.useCallback(async () => {
    const savedData = await editorCore.current.save();
    console.log("savedData", savedData);
    props.onChange(savedData);
  }, []);

  useEffect(() => {
    if (editorCore.current) {
      console.log("core", editorCore.current.render);
      console.log("value", props.value);
      editorCore.current.render({
        blocks: [
          { id: "QqR_l0BYc-", type: "paragraph", data: { text: "sdfsf" } },
        ],
      });
    }
  }, [props.value]);

  return (
    <>
      <ReactEditorJS
        onInitialize={handleInitialize}
        defaultValue={props.value}
        tools={EDITOR_JS_TOOLS}
      />
      <Button onClick={handleSave}>save</Button>
    </>
  );
};

export { Editor };
