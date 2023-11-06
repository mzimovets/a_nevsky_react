const Cities = (props) => {
  const firstCity = "Волгоград";
  const secondCity = "Москва";
  const thirdCity = "Уфа";

  const getNumMax = Math.max(
    firstCity.length,
    secondCity.length,
    thirdCity.length
  );
  const getNumMin = Math.min(
    firstCity.length,
    secondCity.length,
    thirdCity.length
  );

  const getCityMax = () => {
    if (getNumMax === firstCity.length) {
      return (
        <div>
          Город с самым длинным названием - {firstCity}. Кол-во символов:{" "}
          {firstCity.length}
        </div>
      );
    } else if (getNumMax === secondCity.length) {
      return (
        <div>
          Город с самым длинным названием - {secondCity}. Кол-во символов:{" "}
          {secondCity.length}
        </div>
      );
    } else {
      return (
        <div>
          Город с самым длинным названием - {thirdCity}. Кол-во символов:{" "}
          {thirdCity.length}
        </div>
      );
    }
  };

  const getCityMin = () => {
    if (getNumMin === firstCity.length) {
      return (
        <div>
          Город с самым коротким названием - {firstCity}. Кол-во символов:{" "}
          {firstCity.length}
        </div>
      );
    } else if (getNumMin === secondCity.length) {
      return (
        <div>
          Город с самым коротким названием - {secondCity}. Кол-во символов:{" "}
          {secondCity.length}
        </div>
      );
    } else {
      return (
        <div>
          Город с самым коротким названием - {thirdCity}. Кол-во символов:{" "}
          {thirdCity.length}
        </div>
      );
    }
  };

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
          Даны названия трех городов. Вывести на экран самое длинное и самое
          короткое название.
        </p>
        <p style={{ paddingLeft: "30px" }}>9.10</p>
      </div>
      <div>
        Названия городов: {[firstCity, ", ", secondCity, ", ", thirdCity]}
      </div>
      <div>{getCityMax()}</div>
      <div>{getCityMin()}</div>
    </div>
  );
};

export { Cities };
