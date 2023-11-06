// import React from "react";

const Banner = (props) => {
  return (
    <>
      <div style={{ position: "relative", top: 0, left: 0 }}>
        <img
          src="http://maxikon.ru/victor/downloads/Ban-blur.jpeg"
          style={{
            //   backgroundAttachment: "cover",
            // height: "100vh",
            position: "relative",
            top: 0,
            left: 0,
            width: "100%",
            // zIndex: 1,
          }}
        ></img>
        <img
          src="http://maxikon.ru/victor/downloads/Logo.png"
          style={{
            position: "absolute",
            top: "150px",
            left: "150px",
            width: "500px",
            hight: "300px",
          }}
        ></img>
      </div>
    </>
  );
};

export { Banner };
