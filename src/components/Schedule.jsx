import "dayjs/locale/ru";
import parse from "html-react-parser";
import Tiptap from "./Tiptap.tsx";
import { markupToHtml } from "../lib/markup";
import { IconTrash } from "./icons";

const IconPlus = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// Готовим HTML для ячейки: убираем пустые абзацы (в т.ч. <p><br></p> от Tiptap),
// лишние пробелы между тегами и не оборачиваем повторно в <p>.
const BLOCK_RE = /^\s*<(p|div|ul|ol|h[1-6]|br)[\s>/]/i;
const toContent = (value) => {
  let html = markupToHtml(value || "");
  if (typeof document !== "undefined") {
    const box = document.createElement("div");
    box.innerHTML = html;
    box.querySelectorAll("p, div").forEach((n) => {
      const empty =
        !n.textContent.replace(/ /g, "").trim() && !n.querySelector("img");
      if (empty) n.remove();
    });
    html = box.innerHTML;
  }
  html = html
    .replace(/>\s+</g, "><")
    .replace(/<p>\s+/gi, "<p>")
    .replace(/\s+<\/p>/gi, "</p>")
    .trim();
  return BLOCK_RE.test(html) ? html : `<p>${html}</p>`;
};

const MONTHS = {
  "01": "Января",
  "02": "Февраля",
  "03": "Марта",
  "04": "Апреля",
  "05": "Мая",
  "06": "Июня",
  "07": "Июля",
  "08": "Августа",
  "09": "Сентября",
  10: "Октября",
  11: "Ноября",
  12: "Декабря",
};

const monthLiteral = (v) => MONTHS[v] || MONTHS[String(v).padStart(2, "0")] || "";
const dateNum = (v) => (v ? String(parseInt(v, 10)) : "");

// Заголовок дня по умолчанию (когда пользователь его не редактировал вручную).
// В воскресенье — красный, как раньше.
export const defaultHeading = (el) => {
  const parts = [dateNum(el.dateWeek), monthLiteral(el.month)].filter(Boolean);
  const txt = parts.length
    ? `${parts.join(" ")} - ${el.dayWeek}`
    : el.dayWeek || "";
  return el.dayWeek === "Воскресенье"
    ? `<span style="color: #990b0bfd">${txt}</span>`
    : txt;
};

const Schedule = (props) => {
  // На десктопе Tiptap редактируется в режиме правки; на мобильном постер —
  // только предпросмотр (тонкая правка там идёт через размер шрифта).
  const canEditCells =
    props.editable !== undefined ? props.editable : !props.buttonEditState;

  const patch = (id, key, value) => {
    props.setScheduleElements(
      props.scheduleElements.map((el) =>
        el.id === id ? { ...el, [key]: value } : el
      )
    );
  };

  const isSunday = (el) => el.dayWeek === "Воскресенье";

  return (
    <div className="bg-page">
      <div className="font-serif" key={"schedule"}>
        <div className="f-img-block">
          <img src={props.bgSrc || "/background.png"} alt="" />
          <table className="schedule-table" style={{ fontSize: props.fontSize }}>
            <tbody>
              <tr>
                <td
                  style={{
                    textAlign: "center",
                    borderRight: "1px #989898 solid ",
                  }}
                >
                  День недели
                </td>
                <td style={{ textAlign: "center" }}>Святые дня</td>
              </tr>
              {props.scheduleElements?.map((element, i) => {
                const headingValue =
                  element.heading != null && element.heading !== ""
                    ? element.heading
                    : defaultHeading(element);
                const isLast = i === props.scheduleElements.length - 1;
                return (
                  <tr key={element.id || i}>
                    <td style={{ position: "relative" }}>
                      {canEditCells && props.onDeleteDay && (
                        <button
                          type="button"
                          className="schedule-row-del"
                          title="Удалить день"
                          aria-label="Удалить день"
                          onClick={() => props.onDeleteDay(element.id)}
                        >
                          <IconTrash size={15} />
                        </button>
                      )}
                      {canEditCells && props.onAddDay && isLast && (
                        <button
                          type="button"
                          className={
                            i === 0
                              ? "schedule-row-add schedule-row-add--shift"
                              : "schedule-row-add"
                          }
                          title="Добавить день"
                          aria-label="Добавить день"
                          onClick={() => props.onAddDay()}
                        >
                          <IconPlus size={15} />
                        </button>
                      )}
                      {canEditCells && props.onAddDayBefore && i === 0 && (
                        <button
                          type="button"
                          className="schedule-row-add schedule-row-add--top"
                          title="Добавить день сверху (на прошлой неделе)"
                          aria-label="Добавить день сверху"
                          onClick={() => props.onAddDayBefore()}
                        >
                          <IconPlus size={15} />
                        </button>
                      )}
                      <div
                        className="cell-heading"
                        style={{
                          paddingTop: "4px",
                          color: isSunday(element) ? "#990b0bfd" : "black",
                        }}
                      >
                        <Cell
                          editable={canEditCells}
                          value={headingValue}
                          onChange={(value) =>
                            patch(element.id, "heading", value)
                          }
                        />
                      </div>
                      <div
                        style={{
                          paddingRight: "4px",
                          color: isSunday(element) ? "#990b0bfd" : "black",
                        }}
                      >
                        <Cell
                          editable={canEditCells}
                          value={element.prayerTimes}
                          onChange={(value) =>
                            patch(element.id, "prayerTimes", value)
                          }
                        />
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          color: isSunday(element) ? "#990b0bfd" : "black",
                        }}
                      >
                        <Cell
                          editable={canEditCells}
                          value={element.saintsOfDay}
                          onChange={(value) =>
                            patch(element.id, "saintsOfDay", value)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Ячейка постера. В режиме правки — Tiptap для оформления (цвет/шрифт/размер/
 * жирный). Иначе — статический HTML: быстро, без циклов ре-рендера, годится
 * для скрытого узла экспорта.
 */
const Cell = ({ editable, value, onChange }) => {
  if (editable) {
    return <Tiptap isEditable content={toContent(value)} onChange={onChange} />;
  }
  return <div className="tiptap ProseMirror">{parse(toContent(value))}</div>;
};

export { Schedule };
