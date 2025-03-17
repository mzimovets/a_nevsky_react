import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Button, DatePicker, Flex, Input, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Для локализации на русский язык

const Sorok = () => {
  // Состояние для выбранной даты
  const [startDate, setStartDate] = useState(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Управляем состоянием открытия календаря
  const datePickerRef = useRef();

  // ???
  const handleInputChange = (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/\D/g, ""); // Только цифры и заглавные буквы
  };

  // ??
  // Функция для обработки изменения даты
  const onChange = (date, dateString) => {
    setStartDate(date); // Обновляем выбранную дату
    setIsCalendarOpen(false); // Закрываем календарь после выбора даты
    console.log("pum");
  };

  // Вычисляем конец сорокоуста, добавляя 40 дней
  const endDate = startDate.add(40, "day");

  const dateFormat = "DD-MM-YY";

  return (
    <div>
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ display: "table-column", gap: "30px" }}>
          <div className="font-serif" style={{ textAlign: "center" }}>
            Начало сорокоуста{" "}
          </div>
          <Input.OTP
            ref={datePickerRef}
            inputMode="numeric"
            formatter={(str) => str.replace(/\D/g, "").toUpperCase()} // Убираем нечисловые символы и делаем верхний регистр
            maxLength={6} // Ограничение на длину
            onChange={(val) => {
              console.log("onChange", val, datePickerRef.current.blur());
            }}
            onInput={(e) => {
              console.log("input", e);
            }}
          />
          <div style={{ paddingTop: "20px" }}>
            <DatePicker
              locale={locale}
              onChange={onChange}
              value={startDate}
              format={dateFormat}
              open={isCalendarOpen}
              style={{ display: "none" }} // Скрываем стандартный Input
            />
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="font-serif"
                style={{ width: "68px" }}
              >
                <CalendarOutlined />
              </Button>
              <Button style={{ width: "94px" }}>Сбросить</Button>
            </div>
          </div>
          <div
            className="font-serif"
            style={{ paddingTop: "20px", textAlign: "center" }}
          >
            Конец сорокоуста
            <div className="font-serif">{endDate.format(dateFormat)}</div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Sorok };
