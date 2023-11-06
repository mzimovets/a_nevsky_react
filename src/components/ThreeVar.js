const ThreeVar = (props) => {
  let a = 2;
  let b = 4;
  let c = 6;

  const firstPrint = () => {
    return (
      <div>
        a = {a}, b = {b}, c = {c}
      </div>
    );
  };

  const secondPrint = () => {
    let temp1 = b;
    let temp2 = a;
    b = c;
    a = temp1;
    c = temp2;
    return (
      <div>
        а) b = {b}, a = {a}, c = {c}
      </div>
    );
  };

  const thirdPrint = () => {
    let temp1 = b;
    let temp2 = c;
    b = a;
    c = temp1;
    a = temp2;
    return (
      <div>
        б) b = {b}, c = {c}, a = {a}
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
        <div>
          <p>
            Составить программу обмена значеними трех переменныз величин a, b, c
            строкового типа по следующей схеме:
            <br />
            а) b присвоить значение c, а присвоить значение b, c присвоить
            значение а; <br />
            б) b присвоить значение а, с присвоить значение b, а присвоить
            значение c.
          </p>
          <div>{firstPrint()}</div>
          <div>{secondPrint()}</div>
          <div>{thirdPrint()}</div>
        </div>
        <p style={{ paddingLeft: "30px" }}>9.12</p>
      </div>
    </div>
  );
};

export { ThreeVar };
