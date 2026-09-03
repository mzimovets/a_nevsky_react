import React, { useState } from "react";
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from "@heroui/react";
import dayjs from "dayjs";
import "dayjs/locale/ru";

const dateFormat = "DD-MM-YY";

const Sorok = () => {
  const [otp, setOtp] = useState("");

  // DDMMYY → dayjs
  const parsed =
    otp.length === 6
      ? dayjs(
          `20${otp.slice(4, 6)}-${otp.slice(2, 4)}-${otp.slice(0, 2)}`,
          "YYYY-MM-DD",
          true
        )
      : null;
  const start = parsed && parsed.isValid() ? parsed : null;
  const end = start ? start.add(40, "day") : null;

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 p-6">
      <div className="font-serif text-lg">Начало сорокоуста</div>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(v) => setOtp(v.replace(/\D/g, ""))}
        inputMode="numeric"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button variant="outline" className="font-serif" onPress={() => setOtp("")}>
        Сбросить
      </Button>

      <div className="font-serif text-center">
        Конец сорокоуста
        <div className="font-serif text-xl">
          {end ? end.format(dateFormat) : "—"}
        </div>
      </div>
    </div>
  );
};

export { Sorok };
