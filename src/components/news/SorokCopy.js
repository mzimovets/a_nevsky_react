import React, { useRef, useState } from "react";
import { Button, Input, Typography, Collapse } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";

const { Panel } = Collapse;

const SorokCopy = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [results, setResults] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [errors, setErrors] = useState({ day: false, month: false });
  const datePickerRef = useRef();

  const getEastern = (year) => {
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const a = year % 4;
    const b = year % 7;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const f = d + e + 114;
    const month = Math.floor(f / 31);
    const day = (f % 31) + 1;
    return dayjs(new Date(year, month - 1, day)).add(13, "day");
  };

  const calculateSorokoust = (start) => {
    const year = start.year();
    let easter = getEastern(year);
    if (start.isAfter(easter)) easter = getEastern(year + 1);

    const greatLentStart = easter.subtract(48, "day");
    const greatLentEnd = easter.subtract(1, "day");
    const cheesefareWeek = greatLentStart.subtract(7, "day");

    const excluded = {};

    for (let i = 0; i < 7; i++) {
      const day = cheesefareWeek.add(i, "day");
      if (day.day() === 3 || day.day() === 5) {
        excluded[day.format("YYYY-MM-DD")] = "Сырная седмица (среда/пятница)";
      }
    }

    let current = greatLentStart;
    while (current.isBefore(easter)) {
      if (current.day() < 5) {
        excluded[current.format("YYYY-MM-DD")] = "Великий пост (будний день)";
      }
      current = current.add(1, "day");
    }

    const maundyThursday = easter.subtract(3, "day");
    delete excluded[maundyThursday.format("YYYY-MM-DD")];

    const annunciation = dayjs(new Date(easter.year(), 3, 7));
    if (annunciation.isBefore(easter.subtract(7, "day"))) {
      delete excluded[annunciation.format("YYYY-MM-DD")];
    }

    let count = 0;
    let currentDay = start;
    const skipped = [];

    while (count < 40) {
      if (excluded[currentDay.format("YYYY-MM-DD")]) {
        skipped.push({
          date: currentDay.format("DD.MM.YYYY"),
          reason: excluded[currentDay.format("YYYY-MM-DD")],
        });
      } else {
        count++;
      }
      currentDay = currentDay.add(1, "day");
    }

    return {
      endDate: currentDay.subtract(1, "day"),
      skipped,
      easter: easter.format("DD.MM.YYYY"),
      greatLent: `${greatLentStart.format(
        "DD.MM.YYYY"
      )} - ${greatLentEnd.format("DD.MM.YYYY")}`,
      totalDays: currentDay.diff(start, "day"),
    };
  };

  const handleReset = () => {
    setStartDate(dayjs());
    setResults(null);
    setOtpValue("");
    setErrors({ day: false, month: false });
  };

  const getMaxDay = (month, year) => {
    if (month === 2) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  };

  const validateDate = (val) => {
    if (val.length !== 6) {
      setErrors({ day: false, month: false });
      setResults(null);
      return;
    }

    const day = parseInt(val.substring(0, 2)) || 0;
    const month = parseInt(val.substring(2, 4)) || 0;
    const year = 2000 + parseInt(val.substring(4, 6)) || 2000;

    const monthError = month < 1 || month > 12;
    let dayError = false;

    if (!monthError) {
      const maxDay = getMaxDay(month, year);
      dayError = day < 1 || day > maxDay;
    }

    const date = dayjs(`${year}-${month}-${day}`, "YYYY-M-D", true);
    const finalDayError = dayError || !date.isValid();

    setErrors({ day: finalDayError, month: monthError });

    if (!finalDayError && !monthError) {
      setResults(calculateSorokoust(date));
    } else {
      setResults({ error: true });
    }
  };

  const handleDateChange = (val) => {
    setOtpValue(val);
    validateDate(val);
  };

  const dateFormat = "DD-MM-YY";

  return (
    <div className="sorokust" style={{ margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ width: "100%" }}>
          <div
            className="font-serif"
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontFamily: "Rodnik",
              fontWeight: "500",
              fontSize: "38px",
              color: "white",
            }}
          >
            Сорокоуст
          </div>
          <div
            className="font-serif"
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontFamily: "Sorok",
              fontWeight: "bold",
              fontSize: "20px",
              color: "white",
            }}
          >
            Начало сорокоуста
          </div>
          <div style={{ width: 200, margin: "auto" }}>
            <Input.OTP
              ref={datePickerRef}
              inputMode="numeric"
              formatter={(str) => str.replace(/\D/g, "").toUpperCase()}
              maxLength={6}
              value={otpValue}
              onChange={handleDateChange}
              onInput={(e) => {
                setErrors({ day: false, month: false });
                setResults(null);
                console.log("datePickerRef", datePickerRef.current, "e", e);
              }}
              size="large"
            />
          </div>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Button
              type="default"
              onClick={handleReset}
              style={{
                width: 120,
                fontFamily: "Sorok",
                fontWeight: "bold",
                fontSize: "16px",
                color: "rgb(54,64,82)",
              }}
            >
              Сбросить
            </Button>
          </div>

          <div
            className="font-serif"
            style={{
              marginTop: 24,
              textAlign: "center",
              fontFamily: "Sorok",
              fontWeight: "bold",
              fontSize: "20px",
              color: "white",
            }}
          >
            <div>Конец сорокоуста</div>
            <div
              style={{
                minHeight: 24,
                marginTop: 8,
                color: results?.error ? "#ff4d4f" : "inherit",
                fontWeight: 500,
                fontFamily: "Sorok",
                fontWeight: "bold",
                fontSize: "20px",
                color: "white",
              }}
            >
              {otpValue.length === 6 && results
                ? results.error
                  ? "Некорректная дата"
                  : results.endDate.format(dateFormat)
                : "-"}
            </div>
          </div>

          {results && !results.error && (
            <div
              style={{
                width: "248px",
                margin: "auto",
                height: "50wh",
              }}
            >
              <Collapse ghost style={{ marginTop: 24 }}>
                <Panel
                  style={{
                    fontFamily: "Sorok",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "white",
                  }}
                  header="Детали расчета"
                  key="1"
                >
                  <div className="scroll" style={{ overflow: "scroll", height: "400px" }}>
                    <Typography.Text>
                      <p>Дата Пасхи: {results.easter}</p>
                      <p>Великий пост: {results.greatLent}</p>
                      <p>Всего дней: {results.totalDays}</p>
                      {results.skipped.length > 0 && (
                        <>
                          <p style={{ marginBottom: 8 }}>Пропущенные дни:</p>
                          {results.skipped.map((day, i) => (
                            <div
                              key={i}
                              style={{
                                marginBottom: 4,
                                padding: "4px 8px",
                                backgroundColor: "#f6f6f6",
                                borderRadius: 4,
                              }}
                            >
                              <span style={{ fontWeight: 500 }}>
                                {day.date}
                              </span>{" "}
                              - {day.reason}
                            </div>
                          ))}
                        </>
                      )}
                    </Typography.Text>
                  </div>
                </Panel>
              </Collapse>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SorokCopy };
