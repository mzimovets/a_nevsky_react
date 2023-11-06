const Countries = (props) => {
  let s_1 = "Германия";
  let s_2 = "Франция";
  let s_3 = "";

  const firstPrint = () => {
    return (
      <div>
        s1 = {s_1}, s2 = {s_2}
      </div>
    );
  };

  const secondPrint = () => {
    s_3 = s_1;
    s_1 = s_2;
    s_2 = s_3;
    return (
      <div>
        s1 = {s_1}, s2 = {s_2}
      </div>
    );
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
          Даны названия двух стран. Присвоить эти названия переменным величинам
          s1 и s2, после чего обменять значения величин s1 и s2.
        </p>
        <p style={{ paddingLeft: "30px" }}>9.11</p>
      </div>
      <div>{firstPrint()}</div>
      <div>Обмениваем значения величин:</div>
      <div>{secondPrint()}</div>
    </div>
  );
};

export { Countries };
