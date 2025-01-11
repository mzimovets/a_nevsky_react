import { Input } from "antd";
import "dayjs/locale/ru";
import parse from "html-react-parser";
import Tiptap from "./Tiptap.tsx";

const { TextArea } = Input;

const Schedule = (props) => {
  const monthLiteral = (value) => {
    const options = [
      { value: "01", label: "Января" },
      { value: "02", label: "Февраля" },
      { value: "03", label: "Мара" },
      { value: "04", label: "Апреля" },
      { value: "05", label: "Мая" },
      { value: "06", label: "Июня" },
      { value: "07", label: "Июля" },
      { value: "08", label: "Августа" },
      { value: "09", label: "Сентября" },
      { value: "10", label: "Октября" },
      { value: "11", label: "Ноября" },
      { value: "12", label: "Декабря" },
    ];
    let monthName = "";
    // console.log(typeof value);
    options.forEach((option) => {
      // console.log("value option value", value, option.value);
      if (value === option.value) {
        monthName = option.label;
      }
    });
    return monthName + " -";
  };

  const dateNum = (value) => {
    const numbers = [
      { value: "01", label: "1" },
      { value: "02", label: "2" },
      { value: "03", label: "3" },
      { value: "04", label: "4" },
      { value: "05", label: "5" },
      { value: "06", label: "6" },
      { value: "07", label: "7" },
      { value: "08", label: "8" },
      { value: "09", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" },
      { value: "13", label: "13" },
      { value: "14", label: "14" },
      { value: "15", label: "15" },
      { value: "16", label: "16" },
      { value: "17", label: "17" },
      { value: "18", label: "18" },
      { value: "19", label: "19" },
      { value: "20", label: "20" },
      { value: "21", label: "21" },
      { value: "22", label: "22" },
      { value: "23", label: "23" },
      { value: "24", label: "24" },
      { value: "25", label: "25" },
      { value: "26", label: "26" },
      { value: "27", label: "27" },
      { value: "28", label: "28" },
      { value: "29", label: "29" },
      { value: "30", label: "30" },
      { value: "31", label: "31" },
    ];
    let num = "";
    console.log("value", value, typeof value);
    numbers.forEach((number) => {
      if (value === number.value) {
        num = number.label;
      }
    });
    return num;
  };

  const paragraph = (prayerTimes) => {
    console.log("prTime: ", prayerTimes);
    const highlightedText = redHighlight(prayerTimes) || "";
    console.log("highlightedText", highlightedText);
    const preparedBoldText = boldText(highlightedText) || "";
    const text = preparedBoldText.split("\n");
    console.log(highlightedText);
    console.log("text: ", text);
    return text.map((newText) => {
      return <p style={{ margin: "0px" }}>{parse(newText)}</p>;
    });
  };

  const redHighlight = (text) => {
    return text.replaceAll(new RegExp(/\*.+\*/g), (x, y, z) => {
      console.log(x, y, z);
      console.log("Нашли вот это", x);
      const openSpan = `<span style = "color: #990b0bfd">`;
      const closeSpan = "</span>";
      const xWithOpenSpan = x.replace("*", openSpan);
      return xWithOpenSpan.replace("*", closeSpan);
    });
  };

  const boldText = (text) => {
    console.log("boldText", text);
    return text.replaceAll(new RegExp(/\@.+\@/g), (x, y, z) => {
      console.log("boldText", x, y, z);
      console.log(x, y, z);
      console.log("Нашли вот это", x);
      const openSpan = `<b>`;
      const closeSpan = "</b>";
      const xWithOpenSpan = x.replace("@", openSpan);
      const long = xWithOpenSpan.replace("@", closeSpan);
      console.log("boldText", long);
      return long;
    });
  };

  return (
    <div className="font-serif">
      <div className="f-img-block">
        <img src="background.png"></img>
        <table className="schedule-table" style={{ fontSize: props.fontSize }}>
          <tr>
            <td
              style={{ textAlign: "center", borderRight: "1px #989898 solid " }}
            >
              День недели
            </td>
            <td style={{ textAlign: "center" }}>Святые дня</td>
          </tr>
          {props.scheduleElements?.map((element) => {
            console.log("times: ", element.prayerTimes);
            return (
              <tr key={element.id}>
                <td>
                  <div
                    style={{
                      paddingTop: "4px",
                      display: "flex",
                      color:
                        element.dayWeek === "Воскресенье"
                          ? "#990b0bfd"
                          : "black",
                    }}
                  >
                    <div>{dateNum(element.dateWeek)}</div>
                    <div style={{ paddingLeft: "4px" }}>
                      {monthLiteral(element.month)}
                    </div>
                    <div style={{ paddingLeft: "10px" }}>{element.dayWeek}</div>
                  </div>
                  <div>
                    <div
                      style={{
                        paddingRight: "4px",
                        color:
                          element.dayWeek === "Воскресенье"
                            ? "#990b0bfd"
                            : "black",
                      }}
                    >
                      {props.buttonEditState === false ? (
                        // <TextArea
                        <Tiptap
                          content={`<p>${element.prayerTimes}</p>`}
                          // disabled={props.buttonEditState}
                          onChange={(value) => {
                            console.log("sdfsdf", value);
                            const newSchedule = [...props.scheduleElements];
                            newSchedule.forEach((newElement) => {
                              if (newElement.id === element.id) {
                                newElement.prayerTimes = value;
                              }
                            });
                            props.setScheduleElements(newSchedule);
                          }}
                        />
                      ) : (
                        <div>{paragraph(element.prayerTimes)}</div>
                      )}
                    </div>
                  </div>
                </td>

                <td onClick={() => {}}>
                  {" "}
                  <div>
                    {props.buttonEditState === false ? (
                      <Tiptap
                        content={`<p>${element.saintsOfDay}</p>`}
                        // disabled={props.buttonEditState}
                        onChange={(value) => {
                          const newSchedule = [...props.scheduleElements];
                          newSchedule.forEach((newElement) => {
                            if (newElement.id === element.id) {
                              newElement.saintsOfDay = value;
                            }
                          });
                          props.setScheduleElements(newSchedule);
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color:
                            element.dayWeek === "Воскресенье"
                              ? "#990b0bfd"
                              : "black",
                        }}
                      >
                        {paragraph(element.saintsOfDay)}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export { Schedule };
