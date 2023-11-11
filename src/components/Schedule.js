import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Input, Button, DatePicker, Select } from "antd";

const { TextArea } = Input;

const Schedule = (props) => {
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

  const onChangeWeek = (date, dateString) => {
    const daysOfWeek = getWeekDays(date);
    const newSchedule = scheduleElements.map((element, index) => {
      element.dateWeek = daysOfWeek[index].day;
      element.month = daysOfWeek[index].month;
      return element;
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

  const monthLiteral = (value) => {
    const options = [
      { value: "1", label: "Январь" },
      { value: "2", label: "Февраль" },
      { value: "3", label: "Март" },
      { value: "4", label: "Апрель" },
      { value: "5", label: "Май" },
      { value: "6", label: "Июнь" },
      { value: "7", label: "Июль" },
      { value: "8", label: "Август" },
      { value: "9", label: "Сентябрь" },
      { value: "10", label: "Октябрь" },
      { value: "11", label: "Ноябрь" },
      { value: "12", label: "Декабрь" },
    ];
    let monthName = "";
    options.forEach((option) => {
      if (value === option.value) {
        monthName = option.label;
      }
      return monthName;
    });
  };

  const dateNum = (value) => {
    const numbers = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" },
      { value: "13", label: "13" },
      { value: "14", label: "14" },
      { value: "15", label: "15" },
      { value: "16", label: "16" },
      { value: "17", label: "17" },
      { value: "18", label: "18" },
      { value: "19", label: "19" },
      { value: "20", label: "20" },
      { value: "21", label: "21" },
      { value: "22", label: "22" },
      { value: "23", label: "23" },
      { value: "24", label: "24" },
      { value: "25", label: "25" },
      { value: "26", label: "26" },
      { value: "27", label: "27" },
      { value: "28", label: "28" },
      { value: "29", label: "29" },
      { value: "30", label: "30" },
      { value: "31", label: "31" },
    ];
    let num = "";
    numbers.forEach((number) => {
      if (value === number.value) {
        num = number.label;
      }
      return num;
    });
  };

  return (
    <div>
      <DatePicker onChange={onChangeWeek} picker="week" />
      <table className="schedule-table">
        <tr>
          <td style={{ textAlign: "center" }}>День недели</td>
          <td style={{ textAlign: "center" }}>Святые дня</td>
        </tr>
        {scheduleElements.map((element) => {
          return (
            <tr key={element.id}>
              <td>
                <div style={{ display: "flex" }}>
                  <Select
                    value={element.dateWeek}
                    style={{ width: 60 }}
                    disabled={true}
                    onChange={(value) => {
                      changeOnDateChange(value, element);
                    }}
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "6", label: "6" },
                      { value: "7", label: "7" },
                      { value: "8", label: "8" },
                      { value: "9", label: "9" },
                      { value: "10", label: "10" },
                      { value: "11", label: "11" },
                      { value: "12", label: "12" },
                      { value: "13", label: "13" },
                      { value: "14", label: "14" },
                      { value: "15", label: "15" },
                      { value: "16", label: "16" },
                      { value: "17", label: "17" },
                      { value: "18", label: "18" },
                      { value: "19", label: "19" },
                      { value: "20", label: "20" },
                      { value: "21", label: "21" },
                      { value: "22", label: "22" },
                      { value: "23", label: "23" },
                      { value: "24", label: "24" },
                      { value: "25", label: "25" },
                      { value: "26", label: "26" },
                      { value: "27", label: "27" },
                      { value: "28", label: "28" },
                      { value: "29", label: "29" },
                      { value: "30", label: "30" },
                      { value: "31", label: "31" },
                    ]}
                  />

                  <Select
                    value={element.month}
                    style={{ width: 120 }}
                    disabled={true}
                    onChange={(value) => {
                      changeOnMonthChange(value, element);
                    }}
                    options={[
                      { value: "1", label: "Январь" },
                      { value: "2", label: "Февраль" },
                      { value: "3", label: "Март" },
                      { value: "4", label: "Апрель" },
                      { value: "5", label: "Май" },
                      { value: "6", label: "Июнь" },
                      { value: "7", label: "Июль" },
                      { value: "8", label: "Август" },
                      { value: "9", label: "Сентябрь" },
                      { value: "10", label: "Октябрь" },
                      { value: "11", label: "Ноябрь" },
                      { value: "12", label: "Декабрь" },
                    ]}
                  />

                  {/* день недели */}
                  <div style={{ paddingLeft: "4px" }}>{element.dayWeek}</div>
                  <div style={{ paddingLeft: "4px" }}>
                    {monthLiteral(element.month)}
                  </div>
                  <div style={{ paddingLeft: "4px" }}>
                    {dateNum(element.dateWeek)}
                  </div>
                  <div>{monthLiteral}</div>
                </div>
                <TextArea
                  rows={4}
                  placeholder="Укажите расписание"
                  value={element.prayerTimes}
                  disabled={buttonEditState}
                  onChange={(e) => {
                    console.log(e.target.value);
                    const newSchedule = [...scheduleElements];
                    newSchedule.forEach((newElement) => {
                      if (newElement.id === element.id) {
                        newElement.prayerTimes = e.target.value;
                      }
                    });
                    setScheduleElements(newSchedule);
                  }}
                />
              </td>
              <td onClick={() => {}}>
                {" "}
                <TextArea
                  rows={4}
                  placeholder="Святые дня"
                  value={element.saintsOfDay}
                  disabled={buttonEditState}
                  onChange={(e) => {
                    console.log(e.target.value);
                    const newSchedule = [...scheduleElements];
                    newSchedule.forEach((newElement) => {
                      if (newElement.id === element.id) {
                        newElement.saintsOfDay = e.target.value;
                      }
                    });
                    setScheduleElements(newSchedule);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </table>
      <Button
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
  );
};

export { Schedule };
