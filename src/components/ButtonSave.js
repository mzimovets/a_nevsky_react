import React, { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Schedule } from "./Schedule";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/ru_RU";
import "dayjs/locale/ru";

document.getElementsByTagName("an-schedule-bg.").ondragstart = function () {
  return false;
};

const ButtonSave = () => {
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
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

  // const [preFillButton, setPreFillButton] = useState(false); //----------->
  const [buttonEditState, setButtonEditState] = useState(true);
  const [scheduleElements, setScheduleElements] = useState([
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
  ]);

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

  return (
    <>
      <div
        style={{
          paddingTop: "24px",
          position: "absolute",
          zIndex: "5",
        }}
      >
        <div style={{ paddingLeft: "60px" }}>
          <DatePicker
            locale={locale}
            className="font-serif"
            onChange={onChangeWeek}
            picker="week"
            style={{ width: "180px" }}
          />
        </div>
        <div style={{ paddingLeft: "60px" }}>
          <Button
            className="font-serif"
            style={{ width: "180px" }}
            onClick={() => {
              console.log("меня нажали", scheduleElements);
              setButtonEditState(false);
              if (buttonEditState === false) {
                setButtonEditState(true);
              }
            }}
          >
            {buttonEditState === true ? "Редактировать" : "Сохранить"}
          </Button>
        </div>
        {!buttonEditState && (
          <div style={{ paddingLeft: "40px" }}>
            <Button className="font-serif" style={{ width: "220px" }}>
              Предзаполнить расписание
            </Button>
          </div>
        )}
        <div style={{ paddingLeft: "60px" }}>
          <Button
            className="font-serif"
            onClick={onButtonClick}
            style={{ width: "180px" }}
            disabled={buttonEditState === false}
          >
            Сохранить в png
          </Button>
        </div>
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
