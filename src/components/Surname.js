const Surname = (props) => {
  const firstSurname = "Петров";
  const secondSurname = "Ивановский";
  return (
    <div
      style={{
        width: "37%",
        padding: "14px",
        marginLeft: "14px",
        marginTop: "14px",
        border: "2mm ridge rgba(211, 220, 50, .6)",
      }}
    >
      <div style={{ display: "flex" }}>
        <p>Даны две фамилии. Определить, какая из них длинее.</p>
        <p style={{ paddingLeft: "210px" }}>9.9</p>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          Первая фамилия: {firstSurname}, вторая: {secondSurname}
        </div>
      </div>
      {firstSurname.length > secondSurname.length ? (
        <div>
          Первая фамилия "{firstSurname}" длинее - {firstSurname.length}{" "}
          символов
        </div>
      ) : (
        <div>
          Вторая фамилия "{secondSurname}" длинее - {secondSurname.length}{" "}
          символов
        </div>
      )}
    </div>
  );
};

export { Surname };
