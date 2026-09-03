import React, { useState, useEffect } from "react";
const CurrentData = () => {
  const [date, setDate] = useState("");
  useEffect(() => {
    // Функция для форматирования даты в нужный формат
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы с 0
      const year = String(date.getFullYear()).slice(-2);
      return `${day}.${month}.${year}`;
    };

    const today = new Date();
    setDate(formatDate(today));
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
        marginLeft: "48px",
        fontWeight: "bold",
        color: "gray",
      }}
    >
      {" "}
      {date}
    </div>
  );
};

export default CurrentData;
