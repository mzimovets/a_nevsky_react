const Town = (props) => {
  const townName = "Волгоград";
  const lenName = townName.length;
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
          Дано название города. Определить, четно или нет количество символов в
          нем.
        </p>
        <p style={{ paddingLeft: "30px" }}>9.8</p>
      </div>
      <div>Название города: {townName}</div>
      <div>Количество символов - {lenName}</div>
      {lenName % 2 === 0 ? (
        <div>Четное количество символов</div>
      ) : (
        <div> Нечетное количество символов</div>
      )}
    </div>
  );
};

export { Town };
