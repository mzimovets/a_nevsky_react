/**
 * Быстрые вставки типовых фраз в поля расписания (кнопки в плашке
 * форматирования Tiptap). Нажатие добавляет фразу отдельным абзацем,
 * повторное — убирает; пока фраза в тексте, кнопка подсвечена.
 */

export const SCHEDULE_SNIPPETS = [
  {
    // может повторяться в одном дне несколько раз → каждое нажатие добавляет
    id: "bishop",
    mode: "repeat",
    label: "Службу возглавляет митрополит ФЕОДОР",
    text: "(Службу возглавляет митрополит ФЕОДОР)",
  },
  {
    // одна строка на день → нажатие добавляет, повторное убирает
    id: "akathist",
    mode: "toggle",
    label: "Акафист св. блгв. князю Александру Невскому",
    text: "Вечернее богослужение. Акафист св. благоверному князю Александру Невскому",
  },
];

const norm = (s) =>
  (s || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();

export const htmlHasSnippet = (html, text) =>
  norm((html || "").replace(/<[^>]*>/g, " ")).includes(norm(text));

export const addSnippetHtml = (html, text) => {
  const cur = (html || "").trim();
  return cur ? `${cur}<p>${text}</p>` : `<p>${text}</p>`;
};

export const removeSnippetHtml = (html, text) => {
  const src = html || "";
  const needle = norm(text);
  if (typeof document === "undefined") {
    return src.split(text).join("").replace(/<p>\s*<\/p>/gi, "").trim();
  }
  const box = document.createElement("div");
  box.innerHTML = src;
  box.querySelectorAll("p, div, li").forEach((n) => {
    const t = norm(n.textContent);
    if (!t.includes(needle)) return;
    if (t === needle) n.remove();
    else n.textContent = norm(t.replace(needle, ""));
  });
  let out = box.innerHTML.replace(/<p>\s*<\/p>/gi, "").trim();
  // запасной путь: фраза лежала без тегов (старый формат с \n)
  if (htmlHasSnippet(out, text)) out = out.split(text).join("").trim();
  return out;
};

export const toggleSnippetHtml = (html, text) =>
  htmlHasSnippet(html, text)
    ? removeSnippetHtml(html, text)
    : addSnippetHtml(html, text);
