import React, { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Schedule } from "./Schedule";
import { InfoModal } from "./InfoModal";
import { Button, DatePicker, Upload, message, ConfigProvider } from "antd";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/ru_RU";
import "dayjs/locale/ru";
import { Select, Space, Form } from "antd";
import { InboxOutlined } from "@ant-design/icons";

document.getElementsByTagName("background.jpg").ondragstart = function () {
  return false;
};

const { Dragger } = Upload;

const ButtonSave = () => {
  useEffect(() => {
    fetch("/schedule")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("fetchedData", data);
        setScheduleElements(data.data);
        setFontSize(data.meta?.fontSize);
      });
  }, []);
  const [fontSize, setFontSize] = useState("18px");

  const handleChange = (value) => {
    const selectedFont = value[value.length - 1];
    if (selectedFont?.indexOf("px") !== -1) {
      setFontSize(selectedFont);
    } else {
      setFontSize(selectedFont + "px");
    }
    setFontFilter("");
  };
  const ref = useRef(null);

  const [fontFilter, setFontFilter] = useState();

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "Расписание на неделю.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const onChangeWeek = (date, dateString) => {
    const daysOfWeek = getWeekDays(date);
    const newSchedule = scheduleElements.map((element, index) => {
      element.dateWeek = daysOfWeek[index]?.day;
      element.month = daysOfWeek[index].month;
      return element;
    });
    setScheduleElements(newSchedule);
  };

  const initialSchedule = [
    {
      id: "firstSunday",
      dateWeek: "",
      dayWeek: "Воскресенье",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "monday",
      dateWeek: "",
      dayWeek: "Понедельник",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "tuesday",
      dateWeek: "",
      dayWeek: "Вторник",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "wendsday",
      dateWeek: "",
      dayWeek: "Среда",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "thursday",
      dateWeek: "",
      dayWeek: "Четверг",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "friday",
      dateWeek: "",
      dayWeek: "Пятница",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "saturday",
      dateWeek: "",
      dayWeek: "Суббота",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
    {
      id: "secondSunday",
      dateWeek: "",
      dayWeek: "Воскресенье",
      month: "",
      prayerTimes: "",
      saintsOfDay: "",
    },
  ];

  const [buttonEditState, setButtonEditState] = useState(true);
  const [scheduleElements, setScheduleElements] = useState(initialSchedule);

  const props = {
    name: "docx",
    multiple: false,
    maxCount: 1,
    action: "/upload",
    onChange(info) {
      const { status } = info.file;
      console.log("Loading info", info.file.xhr?.response);
      if (info.file.xhr?.status === 200) {
        try {
          const res = JSON.parse(info.file.xhr?.response);
          console.log("REPOS", res);
          setScheduleElements(res.data);
        } catch (e) {
          console.error("error parse json response", e);
        }
      }

      if (status !== "загрузка") {
        console.log(info.file, info.fileList);
      }
      if (status === "готово") {
        message.success(`${info.file.name} файл успешно загружен`);
      } else if (status === "ошибка") {
        message.error(`${info.file.name} загрузка файла не удалась`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const getWeekDays = (value) => {
    const startWeek = dayjs(value).startOf("week");
    const days = [];
    days.push({ day: startWeek.format("DD"), month: startWeek.format("MM") });
    for (let i = 1; i < 8; i++) {
      days.push({
        day: startWeek.add(i, "day").format("DD"),
        month: startWeek.add(i, "day").format("MM"),
      });
    }

    return days;
  };

  const saveSchedule = () => {
    console.log("element", scheduleElements);
    fetch("/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({
        data: scheduleElements,
        meta: { fontSize: fontSize },
      }),
    });
  };

  const getFontSizeOptions = () => {
    const options = [];
    for (let i = 18; i < 25; i++) {
      options.push({
        value: `${i}px`,
        label: `${i}`,
      });
      for (let subI = 1; subI < 10; subI++) {
        options.push({
          value: `${i}.${subI}px`,
          label: `${i}.${subI}`,
        });
      }
    }
    return options;
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: "5",
          paddingTop: "12px",
          right: "14px",
        }}
      >
        {/* <InfoModal /> */}
      </div>
      <div
        style={{
          paddingTop: "24px",
          position: "fixed",
          zIndex: "5",
        }}
      >
        <div style={{ paddingLeft: "22px" }}>
          <DatePicker
            locale={locale}
            className="font-serif"
            onChange={onChangeWeek}
            picker="week"
            style={{ width: "220px", marginBottom: "6px" }}
          />
        </div>
        <div style={{ paddingLeft: "22px" }}>
          <Button
            className="font-serif"
            style={{ width: "220px", marginBottom: "6px" }}
            onClick={() => {
              setButtonEditState(!buttonEditState);
              if (buttonEditState === false) {
                saveSchedule();
              }
            }}
          >
            {buttonEditState === true ? "Редактировать" : "Сохранить"}
          </Button>
        </div>
        {!buttonEditState && (
          <div
            style={{
              paddingLeft: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <Button
              className="font-serif"
              style={{ width: "220px" }}
              onClick={() => {
                const newSchedule = scheduleElements.map((element, index) => {
                  if (element.dayWeek === "Суббота") {
                    element.prayerTimes = `
                    <p>08:00 – Литургия</p>
                    <p>17:00 - Всенощное бдение</p>`;
                  } else if (element.dayWeek === "Воскресенье") {
                    element.prayerTimes = `
                      <p>07:00 – Ранняя Литургия</p>
                      <p>10:00 - Поздняя Литургия</p>
                      <p>17:00 - Вечернее богослужение</p>`;
                  } else {
                    element.prayerTimes = `
                      <p>08:00 - Литургия</p>
                      <p>17:00 - Вечернее богослужение</p>`;
                  }
                  return element;
                });
                setScheduleElements(newSchedule);
              }}
            >
              Предзаполнить расписание
            </Button>
            <Button
              className="font-serif"
              style={{ width: "220px", marginBottom: "6px" }}
              onClick={() => {
                setScheduleElements(initialSchedule);
              }}
            >
              Сбросить расписание
            </Button>
          </div>
        )}
        {!buttonEditState && (
          <div style={{ paddingLeft: "22px" }}>
            <Form layout="vertical">
              <Form.Item style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="font-serif"
                    style={{
                      marginRight: "10px",
                      paddingTop: "6px",
                      paddingBottom: "6px",
                      fontSize: "14px",
                    }}
                  >
                    Размер шрифта:
                  </div>
                  <Select
                    className="font-serif"
                    style={{
                      width: "103px",
                      maxHeight: "32px",
                    }}
                    value={fontSize}
                    onChange={handleChange}
                    searchValue={fontFilter}
                    onSearch={(text) => {
                      if (/^\d*\.?\d*$/.test(text)) {
                        setFontFilter(text);
                        console.log(
                          "textMatch",
                          /^\d*\.?\d*$/.test(text),
                          text
                        );
                      } else {
                        setFontFilter("");
                      }
                    }}
                    mode="tags"
                    tagRender={(props) => {
                      const { label, closable, onClose } = props;
                      return (
                        <span style={{ padding: "4px" }}>
                          {label.replace("px", "")}{" "}
                          {/* Убираем 'px' при отображении */}
                          {closable && <span onClick={onClose}></span>}
                        </span>
                      );
                    }}
                    options={getFontSizeOptions()}
                  />
                </div>
              </Form.Item>
            </Form>
          </div>
        )}

        <div style={{ paddingLeft: "22px" }}>
          <Button
            className="font-serif"
            onClick={onButtonClick}
            style={{ width: "220px", marginBottom: "10px" }}
            disabled={buttonEditState === false}
          >
            Скачать
          </Button>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorPrimaryHover: "rgb(149, 94, 74)",
            },
          }}
        >
          <Dragger {...props} style={{ marginLeft: "22px", width: "220px" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "rgb(149, 94, 74)" }} />
            </p>
            <p className="ant-upload-text" style={{ fontFamily: "Pompadur" }}>
              Нажмите или перетащите документ в эту область для загрузки
            </p>
          </Dragger>
        </ConfigProvider>
      </div>
      {
        <div
          style={{
            width: "911px",
            margin: "auto",
            boxShadow: "0 0 16px #333",
          }}
        >
          <div ref={ref}>
            {
              <Schedule
                fontSize={fontSize}
                scheduleElements={scheduleElements}
                setScheduleElements={setScheduleElements}
                buttonEditState={buttonEditState}
                setButtonEditState={setButtonEditState}
              />
            }
          </div>
        </div>
      }
    </>
  );
};

export { ButtonSave };
