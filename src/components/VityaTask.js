import { Button, Flex } from "antd";
import { useEffect } from "react";
import { useState } from "react";

const VityaTask = (props) => {
  const [displayNum, setDisplayNum] = useState(0);
  const [myStr, setMyStr] = useState("");

  console.log("myStr", myStr);
  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        displayNum {displayNum} {myStr}
      </div>

      <Button
        onClick={() => {
          const upValue = 1 + displayNum;
          setDisplayNum(upValue); //установка значения upValue в переменную displayNum

          setMyStr(myStr + "B");
        }}
      >
        Увеличить число
      </Button>
      <Button
        onClick={() => {
          const downValue = displayNum - 1;
          setDisplayNum(downValue);
          setMyStr(myStr + "И");
        }}
      >
        Уменьшить число
      </Button>
      <Button
        onClick={() => {
          const nullValue = 0;
          setDisplayNum(nullValue);
          setMyStr(myStr + "Т");
        }}
      >
        Сбросить
      </Button>
    </div>
  );
};

export { VityaTask };
