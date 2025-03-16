// src/Tiptap.tsx
import {
  BoldOutlined,
  ItalicOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { Select, Popover } from "antd";
import React, { useState, useRef } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

function removeEmptyParaTags(content) {
  // Create a temporary DOM element to manipulate the HTML content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Find all empty p elements
  const emptyParagraphs = tempDiv.querySelectorAll("p:empty");

  // Remove all empty p elements
  emptyParagraphs.forEach((p) => p.remove());

  // Update the editor with the cleaned HTML content
  return tempDiv.innerHTML;
}

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: "18px", // Дефолтный размер шрифта
        parseHTML: (element) => element.style.fontSize || "18px",
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

interface IProps {
  content: string;
  onChange: (value: string) => void;
}

const Tiptap = (props: IProps) => {
  const editor = useEditor({
    onUpdate({ editor }) {
      props.onChange(editor.getHTML());
      console.log("change", editor.getHTML());
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      Color,
      TextStyle,
      Bold,
      Italic,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: removeEmptyParaTags(props.content),
    editable: true,
  });

  const menuRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       menuRef.current &&
  //       !menuRef.current.contains(event.target) &&
  //       !event.target.closest(".bubbleMenu")
  //     ) {
  //       editor.commands.blur(); // Закрыть bubbleMenu
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [editor]);

  const predefinedColors = [
    "rgba(0, 0, 0, 0.992)",
    "rgba(153, 11, 11, 0.992)",
    "rgba(70, 130, 180, 0.992)",
    "rgba(204, 153, 0, 0.992)",
    "rgba(128, 0, 128, 0.992)",
    "rgba(34, 139, 34, 0.992)",
    "rgba(128, 128, 128, 0.992)",
  ]; // Предустановленные цвета

  const [color, setColor] = useState(
    editor.getAttributes("textStyle").color || predefinedColors[1]
  );

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor);
    editor.chain().focus().setColor(selectedColor).run();
    editor.chain().focus().setMark("textStyle", { fontSize: {} }).run();
    console.log("info", editor.getAttributes("textStyle"));
  };

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleChange = (value) => {
    console.log("handleChange");
    if (value) {
      editor.chain().focus().setFontFamily(value).run();
    }
  };

  const fontSizeOptions = [
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FontSizeOutlined style={{ fontSize: "16px", lineHeight: "1" }} />
        </div>
      ),
      value: "18px",
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FontSizeOutlined style={{ fontSize: "18px", lineHeight: "1" }} />
        </div>
      ),
      value: "22px",
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FontSizeOutlined style={{ fontSize: "20px", lineHeight: "1" }} />
        </div>
      ),
      value: "24px",
    },
  ];

  const handleFontSizeChange = (value: string) => {
    editor.chain().focus().setMark("textStyle", { fontSize: value }).run();
    console.log("handleFontSizeChange", handleFontSizeChange);
  };

  return (
    <>
      <BubbleMenu className="bubbleMenu" editor={editor}>
        <Select
          defaultValue="18px" // Дефолтный размер шрифта
          style={{ width: 68 }}
          options={fontSizeOptions}
          onChange={handleFontSizeChange}
        />
        <div className="divider"></div>
        <Select
          defaultValue="Pompadur"
          style={{ width: 52 }}
          onChange={handleChange}
          options={[
            // { value: "", label: "Выберите шрифт", disabled: true },
            {
              value: "Pompadur",
              label: <span style={{ fontFamily: "Pompadur" }}>А</span>,
            },
            {
              value: "Font",
              label: <span style={{ fontFamily: "Font" }}>А</span>,
            },
          ]}
        />
        <div className="divider"></div>
        <BoldOutlined
          style={{ color: "black" }}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        />
        <ItalicOutlined
          style={{ color: "black" }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        />
        <Popover
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              editor.commands.blur();
              console.log("editor", editor);
            }
          }}
          content={
            <div style={{ display: "flex", gap: "12px" }}>
              {predefinedColors.map((col) => (
                <div
                  key={col}
                  onClick={() => {
                    handleColorChange(col);
                    setIsColorPickerOpen(false); // Закрыть окно после выбора цвета
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "28px", // Внешняя граница
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color === col ? col : "#fff", // Внешняя граница цветом кружка, если выбран
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "24px", // Белая граница
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        width: "20px", // Основной кружок
                        height: "20px",
                        backgroundColor: col,
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          }
          trigger="click"
        >
          <BgColorsOutlined />
        </Popover>
        {isColorPickerOpen && (
          <div
            style={{
              position: "relative",
              bottom: "30px", // Расположить окно над кнопкой
              left: "0",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 1000,
            }}
          >
            {predefinedColors.map((col) => (
              <div
                key={col}
                onClick={() => {
                  handleColorChange(col);
                  setIsColorPickerOpen(false); // Закрыть окно после выбора цвета
                }}
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: col,
                  borderRadius: "50%",
                  cursor: "pointer",
                  border: color === col ? "2px solid #000" : "none",
                }}
              />
            ))}
          </div>
        )}
      </BubbleMenu>
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
