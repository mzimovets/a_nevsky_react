import React, { useState } from "react";
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/ru";

const SorokCopy = () => {
  const [results, setResults] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [errors, setErrors] = useState({ day: false, month: false });

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
      greatLent: `${greatLentStart.format("DD.MM.YYYY")} - ${greatLentEnd.format(
        "DD.MM.YYYY"
      )}`,
      totalDays: currentDay.diff(start, "day"),
    };
  };

  const handleReset = () => {
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
    const clean = val.replace(/\D/g, "");
    setOtpValue(clean);
    validateDate(clean);
  };

  const dateFormat = "DD-MM-YY";

  return (
    <div className="sorokust" style={{ margin: "0 auto" }}>
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 p-6">
        <div
          className="font-serif text-center"
          style={{ fontFamily: "Rodnik", fontWeight: 500, fontSize: 38, color: "white" }}
        >
          Сорокоуст
        </div>
        <div
          className="font-serif text-center"
          style={{ fontFamily: "Sorok", fontWeight: "bold", fontSize: 20, color: "white" }}
        >
          Начало сорокоуста
        </div>

        <InputOTP
          maxLength={6}
          value={otpValue}
          onChange={handleDateChange}
          inputMode="numeric"
          isInvalid={errors.day || errors.month}
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button
          variant="outline"
          onPress={handleReset}
          style={{ fontFamily: "Sorok", fontWeight: "bold", fontSize: 16 }}
        >
          Сбросить
        </Button>

        <div
          className="font-serif text-center"
          style={{ fontFamily: "Sorok", fontWeight: "bold", fontSize: 20, color: "white" }}
        >
          <div>Конец сорокоуста</div>
          <div style={{ minHeight: 24, marginTop: 8, color: results?.error ? "#ff4d4f" : "white" }}>
            {otpValue.length === 6 && results
              ? results.error
                ? "Некорректная дата"
                : results.endDate.format(dateFormat)
              : "-"}
          </div>
        </div>

        {results && !results.error && (
          <details className="w-[260px] rounded-lg bg-white/10 p-3 text-white">
            <summary
              className="cursor-pointer select-none"
              style={{ fontFamily: "Sorok", fontWeight: "bold", fontSize: 12 }}
            >
              Детали расчёта
            </summary>
            <div className="mt-2 max-h-[400px] overflow-auto text-sm">
              <p>Дата Пасхи: {results.easter}</p>
              <p>Великий пост: {results.greatLent}</p>
              <p>Всего дней: {results.totalDays}</p>
              {results.skipped.length > 0 && (
                <>
                  <p className="mb-2 mt-1">Пропущенные дни:</p>
                  {results.skipped.map((day, i) => (
                    <div
                      key={i}
                      className="mb-1 rounded px-2 py-1 text-black"
                      style={{ backgroundColor: "#f6f6f6" }}
                    >
                      <span style={{ fontWeight: 500 }}>{day.date}</span> - {day.reason}
                    </div>
                  ))}
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export { SorokCopy };
