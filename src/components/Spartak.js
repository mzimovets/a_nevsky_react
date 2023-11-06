const Spartak = (props) => {
  const nameClub = "Спартак";
  const lengthName = nameClub.length;
  console.log(nameClub, lengthName);
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
        <p>
          Дано название футбольного клуба. Определить количество символов в нем.
        </p>
        <p style={{ paddingLeft: "37px" }}>9.7</p>
      </div>
      <div>Название клуба: {nameClub}</div>
      <div>Количество символов - {nameClub.length}</div>
    </div>
  );
};

export { Spartak };
