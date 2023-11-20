import React, { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { Schedule } from "./Schedule";
import { Button } from "antd";

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

  return (
    <>
      {<div ref={ref}>{<Schedule />}</div>}
      <div style={{ paddingLeft: "20px" }}>
        <Button className="font-serif" onClick={onButtonClick}>
          Сохранить в png
        </Button>
      </div>
    </>
  );
};

export { ButtonSave };
