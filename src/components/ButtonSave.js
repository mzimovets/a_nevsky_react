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
const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
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

const ButtonSave = () => {
  useEffect(() => {
    fetch("/schedule")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("fetchedData", data);
        setScheduleElements(data.data);
      });
  }, []);
  const [fontSize, setFontSize] = useState("18px");

  const handleChange = (value) => {
    setFontSize(value);
  };
  const ref = useRef(null);

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
      element.dateWeek = daysOfWeek[index].day;
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

  // const [preFillButton, setPreFillButton] = useState(false); //----------->
  const [buttonEditState, setButtonEditState] = useState(true);
  const [scheduleElements, setScheduleElements] = useState(initialSchedule);

  const changeOnDateChange = (value, element) => {
    const newSchedule = [...scheduleElements];

    newSchedule.forEach((newElement) => {
      if (newElement.id === element.id) {
        newElement.dateWeek = value;
      }
    });
    setScheduleElements(newSchedule);
  };

  const changeOnMonthChange = (value, element) => {
    const newSchedule = [...scheduleElements];

    newSchedule.forEach((newElement) => {
      if (newElement.id === element.id) {
        newElement.month = value;
      }
    });
    setScheduleElements(newSchedule);
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
      body: JSON.stringify({ data: scheduleElements }),
    });
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
        <InfoModal />
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
              console.log("меня нажали", scheduleElements);
              setButtonEditState(false);
              if (buttonEditState === false) {
                //
                saveSchedule();
                setButtonEditState(true);
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
                  style={{ width: "103px" }}
                  value={fontSize}
                  onChange={handleChange}
                  options={[
                    {
                      value: "18px",
                      label: "18",
                    },
                    {
                      value: "19px",
                      label: "19",
                    },
                    {
                      value: "20px",
                      label: "20",
                    },
                    {
                      value: "21px",
                      label: "21",
                    },
                    {
                      value: "22px",
                      label: "22",
                    },
                    {
                      value: "23px",
                      label: "23",
                    },
                    {
                      value: "24px",
                      label: "24",
                    },
                  ]}
                />
              </div>
            </Form.Item>
          </Form>
        </div>

        {/* <form
          style={{ marginBottom: "6px" }}
          action="/upload"
          method="post"
          enctype="multipart/form-data"
        >
          <input type="file" name="docx" />
          <input type="submit" onClick={(e) => {}} />
        </form> */}

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
