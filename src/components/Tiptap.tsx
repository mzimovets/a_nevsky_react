// src/Tiptap.tsx
import {
  IconBold as BoldIcon,
  IconItalic as ItalicIcon,
  IconMitre,
  IconKnight,
} from "./icons";
import { SCHEDULE_SNIPPETS, htmlHasSnippet } from "../lib/snippets";
import { useState, useRef, useEffect } from "react";
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
        // default: "18px", // Дефолтный размер шрифта
        parseHTML: (element) => element.style.fontSize, //|| "18px",
        renderHTML: (attributes) => {
          // fontSize иногда приходит объектом ({}) из color-хендлера — игнорируем
          if (!attributes.fontSize || typeof attributes.fontSize !== "string") {
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
  isEditable: boolean;
}

/**
 * Быстрая фраза. Вставляется НА МЕСТО выделения / курсора (что выделено —
 * заменяется фразой). mode "repeat" — вставляет каждый раз. mode "toggle" —
 * если фраза уже есть в поле, нажатие её убирает, иначе вставляет.
 */
const insertSnippetAtCursor = (editor, text: string) => {
  editor.chain().focus().insertContent(text).run();
};

const runSnippet = (editor, text: string, mode: string) => {
  if (mode === "toggle") {
    const doc = editor.state.doc;
    let range: { from: number; to: number } | null = null;
    doc.descendants((node: any, pos: number) => {
      if (range) return false;
      if (node.isText && node.text && node.text.includes(text)) {
        const start = pos + node.text.indexOf(text);
        range = { from: start, to: start + text.length };
        return false;
      }
      return true;
    });
    if (range) {
      editor.chain().focus().deleteRange(range).run();
      return;
    }
  }
  insertSnippetAtCursor(editor, text);
};

const FONT_SIZE_OPTIONS = [
  { title: "Обычный", value: "", glyph: 13 },
  { title: "Средний", value: "20px", glyph: 17 },
  { title: "Крупный", value: "24px", glyph: 21 },
  { title: "Очень крупный", value: "28px", glyph: 26 },
];

const Tiptap = (props: IProps) => {
  // Кажется при изменении пропсов useEditor не работает
  const editor = useEditor(
    {
      onUpdate({ editor }) {
        props.onChange(editor.getHTML());
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
      editable: props.isEditable,
    },
    [props.isEditable]
  );

  const predefinedColors = [
    "rgba(0, 0, 0, 0.992)",
    "rgba(153, 11, 11, 0.992)",
    "rgba(70, 130, 180, 0.992)",
    "rgba(204, 153, 0, 0.992)",
    "rgba(128, 0, 128, 0.992)",
    "rgba(34, 139, 34, 0.992)",
    "rgba(128, 128, 128, 0.992)",
  ]; // Предустановленные цвета

  const [, force] = useState(0);
  const [openPanel, setOpenPanel] = useState<null | "size" | "color">(null);

  const handleColorChange = (selectedColor) => {
    editor.chain().focus().setColor(selectedColor).run();
  };

  // выпадашки (размер / цвет) сворачиваются по клику вне плашки
  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent) => {
      const menu = (e.target as HTMLElement)?.closest?.(".bubbleMenu");
      if (!menu) setOpenPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openPanel]);

  // перерисовываем плашку при смене выделения — чтобы подсветка активных
  // кнопок (жирный/курсив/цвет/шрифт/размер) была актуальной
  useEffect(() => {
    if (!editor) return;
    const rerender = () => force((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  // Внешнее изменение content (предзаполнение, загрузка DOCX, смена недели) —
  // подхватываем ТОЛЬКО когда изменился сам проп и пользователь не в ячейке.
  const lastContent = useRef(props.content);
  useEffect(() => {
    if (!editor) return;
    if (props.content === lastContent.current) return;
    lastContent.current = props.content;
    if (!editor.isFocused) {
      editor.commands.setContent(removeEmptyParaTags(props.content), false);
    }
  }, [props.content, editor]);

  const handleChange = (value) => {
    if (!value) return;
    if (editor.isActive("textStyle", { fontFamily: value })) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(value).run();
    }
  };

  const handleFontSizeChange = (value: string) => {
    editor.chain().focus().setMark("textStyle", { fontSize: value }).run();
  };

  if (!editor) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || "";
  const activeColor = editor.getAttributes("textStyle").color || "";
  const isPompadur = editor.isActive("textStyle", { fontFamily: "Pompadur" });

  return (
    <div>
      <BubbleMenu
        className="bubbleMenu"
        editor={editor}
        // держим плашку открытой, пока есть выделение — клики по кнопкам
        // её не закрывают; закроется, когда выделение спадёт (клик мимо)
        shouldShow={({ editor: e, state }) =>
          e.isEditable && !state.selection.empty
        }
        tippyOptions={{
          maxWidth: "none",
          duration: 120,
          interactive: true,
          hideOnClick: false,
        }}
      >
        {/* Раскрытая строка (размер / цвет) — над плашкой */}
        {openPanel && (
          <div
            className="bubbleMenu__pop"
            onMouseDown={(e) => e.preventDefault()}
          >
            {openPanel === "size" &&
              FONT_SIZE_OPTIONS.map((o) => (
                <button
                  key={o.value || "def"}
                  type="button"
                  title={o.title}
                  className={
                    currentSize === o.value ? "tt-pill is-active" : "tt-pill"
                  }
                  onClick={() => handleFontSizeChange(o.value)}
                >
                  <span style={{ fontSize: o.glyph, fontWeight: 700, lineHeight: 1 }}>
                    А
                  </span>
                </button>
              ))}
            {openPanel === "color" &&
              predefinedColors.map((col) => (
                <button
                  type="button"
                  key={col}
                  aria-label="Цвет текста"
                  className={
                    activeColor === col ? "tt-swatch is-active" : "tt-swatch"
                  }
                  style={{ background: col }}
                  onClick={() => handleColorChange(col)}
                />
              ))}
          </div>
        )}

        <div className="bubbleMenu__row" onMouseDown={(e) => e.preventDefault()}>
          {/* Размер */}
          <button
            type="button"
            className={
              openPanel === "size" ? "tt-pop__toggle is-open" : "tt-pop__toggle"
            }
            title="Размер шрифта"
            onClick={() => setOpenPanel((p) => (p === "size" ? null : "size"))}
          >
            <span style={{ fontWeight: 700, fontSize: 15 }}>А</span>
            <span className="tt-pop__caret">▾</span>
          </button>

          <span className="tt-sep" />

          {/* Шрифт */}
          <div className="tt-group">
            <button
              type="button"
              title="Устав"
              className={isPompadur ? "tt-chip is-active" : "tt-chip"}
              style={{ fontFamily: "Pompadur" }}
              onClick={() => handleChange("Pompadur")}
            >
              Аа
            </button>
            <button
              type="button"
              title="Обычный шрифт"
              className={!isPompadur ? "tt-chip is-active" : "tt-chip"}
              style={{ fontFamily: "Font" }}
              onClick={() => handleChange("Font")}
            >
              Аа
            </button>
          </div>

          <span className="tt-sep" />

          {/* Начертание */}
          <div className="tt-group">
            <button
              type="button"
              className={editor.isActive("bold") ? "tt-btn is-active" : "tt-btn"}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Жирный"
            >
              <BoldIcon size={16} />
            </button>
            <button
              type="button"
              className={
                editor.isActive("italic") ? "tt-btn is-active" : "tt-btn"
              }
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Курсив"
            >
              <ItalicIcon size={16} />
            </button>
          </div>

          <span className="tt-sep" />

          {/* Цвет */}
          <button
            type="button"
            className={
              openPanel === "color" ? "tt-pop__toggle is-open" : "tt-pop__toggle"
            }
            title="Цвет текста"
            onClick={() => setOpenPanel((p) => (p === "color" ? null : "color"))}
          >
            <span
              className="tt-pop__dot"
              style={{ background: activeColor || predefinedColors[0] }}
            />
            <span className="tt-pop__caret">▾</span>
          </button>

          <span className="tt-sep" />

          {/* Быстрые вставки типовых фраз */}
          <div className="tt-group">
            {SCHEDULE_SNIPPETS.map((s) => {
              const Icon = s.id === "bishop" ? IconMitre : IconKnight;
              // подсветка только у тумблера; «repeat» — обычная кнопка-добавление
              const active =
                s.mode === "toggle" && htmlHasSnippet(editor.getHTML(), s.text);
              return (
                <button
                  key={s.id}
                  type="button"
                  title={s.label}
                  aria-label={s.label}
                  className={active ? "tt-btn is-active" : "tt-btn"}
                  onClick={() => runSnippet(editor, s.text, s.mode)}
                >
                  <Icon size={s.id === "akathist" ? 22 : 16} />
                </button>
              );
            })}
          </div>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
