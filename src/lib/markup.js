/**
 * Разметка расписания:
 *   *текст*  → красный  (цвет собора #990b0b)
 *   @текст@  → жирный
 *
 * Функции redHighlight / boldText исторически жили внутри Schedule.js.
 * Вынесены сюда, чтобы их же использовала мобильная форма редактирования.
 */

export const SACRED_RED = "#990b0bfd";

// *...* → <span style="color: #990b0bfd">...</span>
export const redHighlight = (text) => {
  if (!text) return text ?? "";
  return text.replaceAll(new RegExp(/\*.+?\*/g), (x) => {
    const openSpan = `<span style="color: ${SACRED_RED}">`;
    const closeSpan = "</span>";
    const xWithOpenSpan = x.replace("*", openSpan);
    return xWithOpenSpan.replace("*", closeSpan);
  });
};

// @...@ → <b>...</b>
export const boldText = (text) => {
  if (!text) return text ?? "";
  return text.replaceAll(new RegExp(/\@.+?\@/g), (x) => {
    const openSpan = `<b>`;
    const closeSpan = "</b>";
    const xWithOpenSpan = x.replace("@", openSpan);
    return xWithOpenSpan.replace("@", closeSpan);
  });
};

/** Компиляция разметки в HTML для показа на постере. */
export const markupToHtml = (value) => {
  const raw = value ?? "";
  return boldText(redHighlight(raw));
};

const decodeEntities = (s) => {
  if (typeof document === "undefined") return s;
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
};

/**
 * Обратное преобразование HTML → плоский текст с маркерами *...* / @...@
 * для показа в textarea мобильной формы. Приблизительное, но устойчивое
 * при обратном прогоне через markupToHtml.
 */
export const htmlToMarkup = (html) => {
  if (!html) return "";
  let s = String(html);

  // переносы строк из блочных тегов
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n");
  s = s.replace(/<\/\s*(p|div)\s*>/gi, "\n");
  s = s.replace(/<\s*(p|div)[^>]*>/gi, "");

  // жирный → @...@
  s = s.replace(/<\s*(b|strong)[^>]*>([\s\S]*?)<\/\s*(b|strong)\s*>/gi, "@$2@");

  // любой цветной span → *...*  (на постере значимый цвет — только красный)
  s = s.replace(
    /<\s*span[^>]*color\s*:[^>]*>([\s\S]*?)<\/\s*span\s*>/gi,
    "*$1*"
  );

  // остальные теги выкидываем
  s = s.replace(/<[^>]+>/g, "");

  s = decodeEntities(s);

  // нормализуем пустые строки/пробелы
  s = s.replace(/ /g, " ");
  s = s
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return s.trim();
};
