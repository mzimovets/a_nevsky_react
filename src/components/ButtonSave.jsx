import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { Button, Card, Spinner, Popover, toast } from "@heroui/react";
import {
  IconDownload,
  IconUpload,
  IconStars,
  IconRefresh,
  IconPen,
  IconDiskette,
  IconZoomIn,
  IconZoomOut,
  IconFullScreen,
  IconCalendar,
  IconPlus,
} from "./icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Schedule, defaultHeading } from "./Schedule";
import Tiptap from "./Tiptap.tsx";
import { markupToHtml } from "../lib/markup";
import { IconTrash } from "./icons";

const SCHEDULE_WIDTH = 911;
const SCHEDULE_HEIGHT = 1288.414;
const MOBILE_QUERY = "(max-width: 960px)";
const DRAFT_KEY = "nevsky-schedule-draft";

const DAY_TITLE_MONTHS = {
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

const WEEKDAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const mkDay = (over = {}) => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "d" + Math.random().toString(36).slice(2),
  dateWeek: "",
  dayWeek: "",
  month: "",
  heading: "",
  prayerTimes: "",
  saintsOfDay: "",
  ...over,
});

const initialSchedule = [
  mkDay({ id: "firstSunday", dayWeek: "Воскресенье" }),
  mkDay({ id: "monday", dayWeek: "Понедельник" }),
  mkDay({ id: "tuesday", dayWeek: "Вторник" }),
  mkDay({ id: "wendsday", dayWeek: "Среда" }),
  mkDay({ id: "thursday", dayWeek: "Четверг" }),
  mkDay({ id: "friday", dayWeek: "Пятница" }),
  mkDay({ id: "saturday", dayWeek: "Суббота" }),
  mkDay({ id: "secondSunday", dayWeek: "Воскресенье" }),
];

const getWeekDays = (value, count = 8) => {
  const startWeek = dayjs(value).startOf("week");
  return Array.from({ length: count }, (_, i) => ({
    day: startWeek.add(i, "day").format("DD"),
    month: startWeek.add(i, "day").format("MM"),
  }));
};

const PREFILL = (dayWeek) => {
  if (dayWeek === "Суббота") {
    return `
                    <p>08:00 – Литургия</p>
                    <p>17:00 - Всенощное бдение</p>`;
  }
  if (dayWeek === "Воскресенье") {
    return `
                      <p>07:00 – Ранняя Литургия</p>
                      <p>10:00 - Поздняя Литургия</p>
                      <p>17:00 - Вечернее богослужение</p>`;
  }
  return `
                      <p>08:00 - Литургия</p>
                      <p>17:00 - Вечернее богослужение</p>`;
};

const dateOnly = (el) => {
  const num = el?.dateWeek ? String(parseInt(el.dateWeek, 10)) : "";
  const month = el?.month ? DAY_TITLE_MONTHS[el.month] || "" : "";
  return [num, month].filter(Boolean).join(" ");
};

const toDataUrl = (url) =>
  fetch(url)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result);
          fr.onerror = reject;
          fr.readAsDataURL(blob);
        })
    );

const ButtonSave = () => {
  const [scheduleElements, setScheduleElements] = useState(initialSchedule);
  const [fontSize, setFontSize] = useState("18px");
  const [buttonEditState, setButtonEditState] = useState(true); // true → показываем «Редактировать»
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false
  );
  const [mobileView, setMobileView] = useState("form"); // "form" | "poster"
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bgDataUrl, setBgDataUrl] = useState(null);
  const [confirm, setConfirm] = useState(null); // модалка подтверждения
  const [previewImg, setPreviewImg] = useState(null); // фолбэк-показ PNG для ручного сохранения

  const captureRef = useRef(null);
  const weekAnchorRef = useRef(null); // dayjs начала выбранной недели — для «+ день»
  const restoredRef = useRef(false); // первичная загрузка завершена
  const isEditing = buttonEditState === false;

  // Первичная загрузка: сначала локальный черновик (не теряем данные при
  // перезагрузке страницы / без сервера), затем — сохранённое на сервере.
  useEffect(() => {
    let draft = null;
    try {
      draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    } catch {
      draft = null;
    }
    if (draft?.data?.length) {
      setScheduleElements(draft.data);
      if (draft.fontSize) setFontSize(draft.fontSize);
      toast.info("Восстановлен несохранённый черновик");
    }

    fetch("/schedule")
      .then((res) => res.json())
      .then((data) => {
        // серверные данные применяем только если локального черновика нет
        if (!draft?.data?.length) {
          if (data?.data) setScheduleElements(data.data);
          if (data?.meta?.fontSize) setFontSize(data.meta.fontSize);
        }
      })
      .catch(() => {})
      .finally(() => {
        restoredRef.current = true;
      });
  }, []);

  // Автосохранение черновика в localStorage при любом изменении
  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ data: scheduleElements, fontSize, ts: Date.now() })
      );
    } catch {
      /* приватный режим / переполнение — не критично */
    }
  }, [scheduleElements, fontSize]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    toDataUrl("/background.png").then(setBgDataUrl).catch(() => {});
  }, []);

  const onChangeWeek = (dateValue) => {
    if (!dateValue) return;
    weekAnchorRef.current = dayjs(dateValue).startOf("week");
    setScheduleElements((prev) => {
      const daysOfWeek = getWeekDays(dayjs(dateValue), prev.length);
      return prev.map((element, index) => ({
        ...element,
        dateWeek: daysOfWeek[index]?.day ?? element.dateWeek,
        month: daysOfWeek[index]?.month ?? element.month,
        heading: "", // сбрасываем ручную правку заголовка на новую дату
      }));
    });
  };

  // соседний день от даты `ref` (dir = +1 вперёд / -1 назад)
  const neighbourDay = (ref, dir) => {
    if (!ref?.dateWeek || !ref?.month) return {};
    const year = weekAnchorRef.current?.year() ?? dayjs().year();
    const base = dayjs(
      `${year}-${ref.month}-${ref.dateWeek}`,
      "YYYY-MM-DD"
    ).add(dir, "day");
    if (!base.isValid()) return {};
    return {
      dateWeek: base.format("DD"),
      month: base.format("MM"),
      dayWeek: WEEKDAY_NAMES[base.day()],
    };
  };

  // «+ день» — продолжаем даты/дни недели от последнего дня
  const addDay = () =>
    setScheduleElements((prev) => [
      ...prev,
      mkDay(neighbourDay(prev[prev.length - 1], 1)),
    ]);

  // «+ день сверху» — день назад от первого (на прошлую неделю)
  const addDayBefore = () =>
    setScheduleElements((prev) => [mkDay(neighbourDay(prev[0], -1)), ...prev]);

  const deleteDay = (id) =>
    setScheduleElements((prev) =>
      prev.length > 1 ? prev.filter((el) => el.id !== id) : prev
    );

  const saveSchedule = useCallback(() => {
    return fetch("/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ data: scheduleElements, meta: { fontSize } }),
    });
  }, [scheduleElements, fontSize]);

  const save = useCallback(() => {
    saveSchedule()
      .then(() => {
        // сохранено на сервере — черновик больше не нужен
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        toast.success("Расписание сохранено");
      })
      .catch(() => toast.danger("Не удалось сохранить"));
  }, [saveSchedule]);

  const toggleEdit = () => {
    setButtonEditState((prev) => {
      const next = !prev;
      if (next === true) save(); // выходим из режима правки → сохраняем
      return next;
    });
  };

  const doPrefill = () => {
    setScheduleElements((prev) =>
      prev.map((element) => ({ ...element, prayerTimes: PREFILL(element.dayWeek) }))
    );
  };

  const doReset = () => {
    setScheduleElements(initialSchedule.map((e) => mkDay(e)));
    setFontSize("18px");
  };

  const askPrefill = () =>
    setConfirm({
      title: "Предзаполнить расписание?",
      message:
        "Время богослужений во всех днях будет заменено стандартным шаблоном",
      confirmLabel: "Предзаполнить",
      onConfirm: doPrefill,
    });

  const askReset = () =>
    setConfirm({
      title: "Сбросить расписание?",
      message:
        "Дни недели, время богослужений, святые и размер шрифта вернутся к пустому виду",
      confirmLabel: "Сбросить",
      onConfirm: doReset,
    });

  const handleFontSize = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return;
    setFontSize(`${num}px`);
  };

  const uploadDocx = useCallback(async (file) => {
    if (!file) return false;
    const fd = new FormData();
    fd.append("docx", file);
    const closing = toast("Загружаем документ…", { isLoading: true, timeout: 0 });
    try {
      const res = await fetch("/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !Array.isArray(json?.data)) {
        throw new Error(json?.error || `Ответ сервера: ${res.status}`);
      }
      setScheduleElements(json.data);
      toast.success("Расписание из документа загружено");
      return true;
    } catch (err) {
      console.error("upload docx failed:", err);
      toast.danger("Не удалось разобрать документ: " + (err?.message || "ошибка"));
      return false;
    } finally {
      toast.close(closing);
    }
  }, []);

  const updateField = (id, key, html) => {
    setScheduleElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [key]: html } : el))
    );
  };

  const exportPoster = useCallback(async () => {
    const node = captureRef.current?.querySelector(".f-img-block");
    if (!node) return;
    setIsExporting(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(
        ["Pompadur", "Font", "Sorok", "Rodnik"].map((f) =>
          document.fonts.load(`16px "${f}"`).catch(() => {})
        )
      );
      const dataUrl = await domToPng(node, {
        width: SCHEDULE_WIDTH,
        height: Math.round(SCHEDULE_HEIGHT),
        scale: 2,
        backgroundColor: "#ffffff",
        style: { transform: "none", margin: "0" },
      });

      const fileName = "Расписание на неделю.png";
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });

      // 1) Телефон: системный лист «Поделиться» → «Сохранить изображение / в Файлы»
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: fileName });
          return;
        } catch (err) {
          if (err?.name === "AbortError") return; // пользователь закрыл шит
          // иначе — покажем картинку для ручного сохранения (ниже)
        }
      }

      // 2) Десктоп / Android: обычное скачивание файла
      const isStandalone =
        window.matchMedia?.("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      if (!isMobile && !isStandalone) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        toast.success("Изображение сохранено");
        return;
      }

      // 3) Фолбэк (iOS «как приложение» и т.п.): показать картинку —
      //    сохранить долгим нажатием
      setPreviewImg(dataUrl);
    } catch (err) {
      console.error(err);
      toast.danger("Не удалось сохранить изображение");
    } finally {
      setIsExporting(false);
    }
  }, [isMobile]);

  const fontNum = useMemo(() => parseFloat(fontSize) || 18, [fontSize]);
  const weekRange = useMemo(() => {
    const a = dateOnly(scheduleElements[0]);
    const b = dateOnly(scheduleElements[scheduleElements.length - 1]);
    return a && b ? `${a} – ${b}` : null;
  }, [scheduleElements]);

  // предзаполнить / сбросить / размер шрифта — только в режиме правки
  // (на мобильном форма всегда редактируется)
  const showEditTools = isEditing || isMobile;

  /* ── Панель управления ─────────────────────────────────────────────── */
  const controls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Неделя</span>
        <WeekPicker rangeLabel={weekRange} onPick={onChangeWeek} />
      </div>

      {showEditTools && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 basis-32"
              onPress={askPrefill}
            >
              <IconStars size={16} /> Предзаполнить
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 basis-32"
              onPress={askReset}
            >
              <IconRefresh size={16} /> Сбросить
            </Button>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="text-muted">
              Размер шрифта:{" "}
              <b className="text-foreground">{fontNum.toFixed(1)}</b>
            </span>
            <input
              type="range"
              min="12"
              max="26"
              step="0.1"
              value={fontNum}
              onChange={(e) => handleFontSize(e.target.value)}
              className="accent-brand"
            />
          </div>
        </>
      )}

      <DocxDrop onFile={uploadDocx} />

      <Button
        variant="primary"
        size="sm"
        fullWidth
        onPress={exportPoster}
        isDisabled={isExporting}
        className="bg-brand text-white"
      >
        {isExporting ? <Spinner size="sm" /> : <IconDownload size={16} />} Скачать
      </Button>
    </div>
  );

  /* ── Мобильная форма-список по дням (WYSIWYG) ──────────────────────── */
  const mobileForm = (
    <div className="flex flex-col gap-3 pb-28">
      {scheduleElements.map((el, i) => (
        <Card key={el.id || i} className="p-3">
          <Card.Content className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-line pb-2">
              <div className="form-heading min-w-0 flex-1 font-pompadur text-lg">
                <Tiptap
                  isEditable
                  content={`<p>${markupToHtml(
                    el.heading != null && el.heading !== ""
                      ? el.heading
                      : defaultHeading(el)
                  )}</p>`}
                  onChange={(v) => updateField(el.id, "heading", v)}
                />
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  className="text-sacred"
                  title="Удалить день"
                  aria-label="Удалить день"
                  isDisabled={scheduleElements.length <= 1}
                  onPress={() => deleteDay(el.id)}
                >
                  <IconTrash size={18} />
                </Button>
                {i === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    className="text-brand"
                    title="Добавить день сверху (на прошлой неделе)"
                    aria-label="Добавить день сверху"
                    onPress={addDayBefore}
                  >
                    <IconPlus size={18} />
                  </Button>
                )}
              </div>
            </div>
            <RichField
              label="Время богослужений"
              value={el.prayerTimes}
              onChange={(v) => updateField(el.id, "prayerTimes", v)}
            />
            <RichField
              label="Святые дня"
              value={el.saintsOfDay}
              onChange={(v) => updateField(el.id, "saintsOfDay", v)}
            />
          </Card.Content>
        </Card>
      ))}
      <Button variant="outline" fullWidth onPress={addDay}>
        + Добавить день
      </Button>
    </div>
  );

  /* ── Постер (натуральные 911px), масштаб только для показа ───────────── */
  const posterView = (scaleToFit) => (
    <div
      className="w-full overflow-auto p-6"
      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
    >
      <div
        style={{
          width: SCHEDULE_WIDTH,
          transform: `scale(${scaleToFit})`,
          transformOrigin: "top left",
          boxShadow: "0 0 16px #333",
        }}
      >
        <Schedule
          fontSize={fontSize}
          scheduleElements={scheduleElements}
          setScheduleElements={setScheduleElements}
          buttonEditState={buttonEditState}
          editable={!isMobile && isEditing}
          onDeleteDay={deleteDay}
          onAddDay={addDay}
          onAddDayBefore={addDayBefore}
        />
      </div>
    </div>
  );

  /* ── Скрытый узел строго 911×1288 для экспорта ──────────────────────── */
  const hiddenCapture = (
    <div
      ref={captureRef}
      aria-hidden
      style={{
        position: "fixed",
        left: -100000,
        top: 0,
        width: SCHEDULE_WIDTH,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <Schedule
        fontSize={fontSize}
        scheduleElements={scheduleElements}
        setScheduleElements={() => {}}
        buttonEditState={true}
        editable={false}
        bgSrc={bgDataUrl || "/background.png"}
      />
    </div>
  );

  if (isMobile) {
    const fitScale = Math.min(1, (window.innerWidth - 24) / SCHEDULE_WIDTH) * zoom;
    return (
      <div className="min-h-screen bg-paper px-3 pt-3">
        <SegTabs
          value={mobileView}
          onChange={setMobileView}
          tabs={[
            { id: "form", label: "Расписание" },
            { id: "poster", label: "Постер" },
          ]}
        />

        {mobileView === "form" ? (
          <div className="mt-3">
            <Card className="mb-3 p-3 font-slab">{controls}</Card>
            {mobileForm}
          </div>
        ) : (
          <div className="mt-3">
            <div className="mb-2 flex items-center gap-2">
              <Button variant="outline" size="sm" isIconOnly onPress={() => setZoom((z) => Math.max(0.4, z - 0.15))}>
                <IconZoomOut size={16} />
              </Button>
              <Button variant="outline" size="sm" isIconOnly onPress={() => setZoom(1)}>
                <IconFullScreen size={16} />
              </Button>
              <Button variant="outline" size="sm" isIconOnly onPress={() => setZoom((z) => Math.min(3, z + 0.15))}>
                <IconZoomIn size={16} />
              </Button>
              <label className="ml-2 flex flex-1 items-center gap-2 text-xs">
                Шрифт {fontNum.toFixed(1)}
                <input
                  type="range"
                  min="12"
                  max="26"
                  step="0.1"
                  value={fontNum}
                  onChange={(e) => handleFontSize(e.target.value)}
                  className="flex-1 accent-brand"
                />
              </label>
            </div>
            <div style={{ height: SCHEDULE_HEIGHT * fitScale + 48 }}>
              {posterView(fitScale)}
            </div>
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-10 flex gap-2 border-t border-line bg-white/95 p-3 backdrop-blur">
          <Button variant="outline" className="flex-1" onPress={save}>
            <IconDiskette size={16} /> Сохранить
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-brand text-white"
            onPress={exportPoster}
            isDisabled={isExporting}
          >
            {isExporting ? <Spinner size="sm" /> : <IconDownload size={16} />} Скачать
          </Button>
        </div>

        {hiddenCapture}
        <ConfirmDialog data={confirm} onClose={() => setConfirm(null)} />
        <ImagePreview src={previewImg} onClose={() => setPreviewImg(null)} />
      </div>
    );
  }

  /* ── Десктоп: две колонны ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-[1400px] items-start gap-6 p-6">
        <aside className="sticky top-6 mt-6 max-h-[calc(100vh-3rem)] w-[300px] shrink-0 overflow-y-auto">
          <Card className="p-4 font-slab">
            <Card.Header className="pb-3">
              <Card.Title className="text-lg">
                Расписание богослужений
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="mb-4">
                <Button
                  variant="primary"
                  fullWidth
                  className="bg-brand text-white"
                  onPress={toggleEdit}
                >
                  {isEditing ? <IconDiskette size={16} /> : <IconPen size={16} />}
                  {isEditing ? "Сохранить" : "Редактировать"}
                </Button>
              </div>
              {controls}
            </Card.Content>
          </Card>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-fit">{posterView(1)}</div>
        </main>
      </div>
      {hiddenCapture}
      <ConfirmDialog data={confirm} onClose={() => setConfirm(null)} />
      <ImagePreview src={previewImg} onClose={() => setPreviewImg(null)} />
    </div>
  );
};

/* ── Подкомпоненты ─────────────────────────────────────────────────── */

// Фолбэк сохранения PNG там, где программное скачивание не работает
// (iOS-Safari «добавлено на экран», часть in-app браузеров).
const ImagePreview = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center gap-3 overflow-auto bg-black/85 p-4"
      onClick={onClose}
    >
      <p className="ui-font text-center text-sm text-white">
        Нажмите и удерживайте изображение → «Сохранить в Фото»
      </p>
      <img
        src={src}
        alt="Расписание на неделю"
        className="h-auto w-full max-w-[520px] rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        className="ui-font rounded-full bg-white/90 px-6 py-2 text-sm font-medium"
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  );
};

const ConfirmDialog = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="ui-font w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="ui-font mb-2 text-lg font-semibold">{data.title}</h3>
        <p className="ui-font mb-5 text-sm text-muted">{data.message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onPress={onClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-brand text-white"
            onPress={() => {
              data.onConfirm();
              onClose();
            }}
          >
            {data.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Поле с форматированием: Tiptap + всплывающая панель (BubbleMenu внутри Tiptap)
const RichField = ({ label, value, onChange }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-muted">{label}</span>
    <div className="rich-field rounded-xl border border-line bg-white px-3 py-2 text-base leading-snug focus-within:border-brand">
      <Tiptap
        isEditable
        content={`<p>${markupToHtml(value)}</p>`}
        onChange={onChange}
      />
    </div>
  </label>
);

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

const WeekPicker = ({ rangeLabel, onPick }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => dayjs());
  const [hoverStart, setHoverStart] = useState(null); // воскресенье наведённой недели

  // dayjs без глобальной локали → неделя начинается с воскресенья (как в getWeekDays)
  const gridStart = view.startOf("month").startOf("week");
  const days = Array.from({ length: 42 }, (_, i) => gridStart.add(i, "day"));
  const todayStr = dayjs().format("YYYY-MM-DD");

  return (
    <Popover isOpen={open} onOpenChange={setOpen} placement="bottom-start">
      <Popover.Trigger>
        <Button variant="outline" fullWidth className="justify-between">
          <span className="truncate">{rangeLabel || "Выбрать неделю"}</span>
          <IconCalendar size={18} />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="p-3">
        <div className="w-[264px] select-none">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md px-2 py-1 text-lg hover:bg-line/50"
              onClick={() => setView((v) => v.subtract(1, "month"))}
              aria-label="Предыдущий месяц"
            >
              ‹
            </button>
            <span className="text-sm capitalize">
              {view.locale("ru").format("MMMM YYYY")}
            </span>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-lg hover:bg-line/50"
              onClick={() => setView((v) => v.add(1, "month"))}
              aria-label="Следующий месяц"
            >
              ›
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[11px] text-muted">
            {WEEKDAYS.map((w, i) => (
              <div key={w} className={i === 0 ? "text-sacred" : undefined}>
                {w}
              </div>
            ))}
          </div>
          <div
            className="grid grid-cols-7 gap-0.5"
            onMouseLeave={() => setHoverStart(null)}
          >
            {days.map((d) => {
              const dim = d.month() !== view.month();
              const isToday = d.format("YYYY-MM-DD") === todayStr;
              const isSunday = d.day() === 0; // воскресенье — красным, как на постере
              // подсветка всей недели: от воскресенья до воскресенья (8 дней),
              // как и выбирает onChangeWeek → getWeekDays(..., 8)
              const off = hoverStart ? d.diff(hoverStart, "day") : -1;
              const inWeek = off >= 0 && off <= 7;
              const tone = inWeek
                ? "bg-brand text-white"
                : dim
                ? isSunday
                  ? "text-sacred/40"
                  : "text-muted/40"
                : isSunday
                ? "text-sacred"
                : isToday
                ? "text-brand"
                : "";
              return (
                <button
                  key={d.format("YYYY-MM-DD")}
                  type="button"
                  onMouseEnter={() => setHoverStart(d.startOf("week"))}
                  onClick={() => {
                    onPick(d.toDate());
                    setOpen(false);
                  }}
                  className={`h-8 rounded-md text-sm transition ${
                    inWeek ? "" : "hover:bg-brand/15"
                  } ${tone} ${isToday && !inWeek ? "font-bold" : ""}`}
                >
                  {d.date()}
                </button>
              );
            })}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
};

const SegTabs = ({ value, onChange, tabs }) => (
  <div className="flex rounded-xl bg-line/40 p-1">
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={`flex-1 rounded-lg py-2 text-sm transition ${
          value === t.id ? "bg-white text-foreground shadow-sm" : "text-muted"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const DocxDrop = ({ onFile }) => {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadedName, setLoadedName] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (f) => {
    if (!f || busy) return;
    setBusy(true);
    try {
      const ok = await onFile(f);
      if (ok !== false) setLoadedName(f.name);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => !busy && inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed p-4 text-center text-sm transition ${
        over
          ? "border-brand bg-brand/5"
          : loadedName
          ? "border-brand/50 bg-brand/5"
          : "border-line"
      } ${busy ? "pointer-events-none opacity-70" : ""}`}
    >
      {busy ? (
        <>
          <Spinner size="sm" />
          <span className="text-muted">Загружаем…</span>
        </>
      ) : loadedName ? (
        <>
          <IconUpload size={20} className="text-brand" />
          <span
            className="w-full truncate font-medium text-foreground"
            title={loadedName}
          >
            {loadedName}
          </span>
          <span className="text-xs text-muted">
            Файл загружен — нажмите, чтобы заменить
          </span>
        </>
      ) : (
        <>
          <IconUpload size={20} className="text-brand" />
          <span className="text-brand">Загрузить документ .docx</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export { ButtonSave };
