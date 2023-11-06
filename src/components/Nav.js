// import React from "react";

const Nav = (props) => {
  const menuItems = [
    "О храме",
    "Расписание богослужений",
    "Новости",
    "О вере и церкви",
    "Жизнь храма",
    "Контакты",
  ];

  return (
    <div>
      <ul
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "end",
          padding: "20px",
        }}
      >
        {menuItems.map((item, index) => {
          return (
            <li
              key={`Navitem${index}`}
              style={{
                margin: "10px 50px",
                listStyle: "None",
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { Nav };
