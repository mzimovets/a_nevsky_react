import express from "express";
const app = express();
import bodyParser from "body-parser";
import docxParser from "docx-parser";

//--------NeDB---------
import Datastore from "nedb";

export const database = new Datastore("database.db");
database.loadDatabase();

import { dirname } from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + "/build"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build" + "/index.html");
});

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("express on 4000");
});

app.get("/", (req, res) => {
  res.send("hello my dear");
});

app.get("/schedule", (req, res) => {
  database.findOne({ _id: "schedule" }, (err, doc) => {
    console.log("getting schedule");
    res.json(doc);
  });
});

app.post("/schedule", urlencodedParser, (req, res) => {
  database.insert({ _id: "schedule", data: req.body.data }, (err, docCount) => {
    console.log("insering", err, docCount);
    if (err) {
      database.update(
        { _id: "schedule" },
        { $set: { data: req.body.data } },
        (err, doc) => {
          console.log(err, doc);
          res.json({ status: "ok" });
        }
      );
    }
  });
});

app.post("/upload", upload.single("docx"), function (req, res, next) {
  console.log("POST /upload", req.file);
  const fileName = req.file.originalname;

  docxParser.parseDocx(__dirname + `/uploads/${fileName}`, function (data) {
    let trimmed = data.replace(/Расписание (.+\n){0,4}Святые дня/gm, "");
    trimmed = trimmed.replace(/\r\n\n\n/g, "");
    const dateArray = trimmed.match(/\d+\s.+г\./g);

    const ar = trimmed.split(/\d+\s.+г\./g);

    const ids = [
      "firstSunday",
      "monday",
      "tuesday",
      "wendsday",
      "thursday",
      "friday",
      "saturday",
      "secondSunday",
    ];
    const options = [
      { value: "01", label: "Января" },
      { value: "02", label: "Февраля" },
      { value: "03", label: "Марта" },
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

    const scheduleSeparated = ar?.map((elem, index) => {
      const times = elem.match(/\d+:\d+ – (.*\n)/gm)?.join("");
      const day = elem.substring(times?.length, elem.length);
      const dateString = dateArray[index] || "";

      const monthName = dateString.substring(
        dateString.indexOf(" ") + 1,
        dateString.indexOf("*") - 1
      );

      let monthNumber = "";
      options.forEach((month) => {
        if (month.label.toLocaleLowerCase() === monthName) {
          monthNumber = month.value;
        }
      });
      return {
        dateWeek: dateString.substring(0, dateString.indexOf(" ")),
        dayWeek: dateString.substring(
          dateString.indexOf("*") + 2,
          dateString.lastIndexOf("*") - 1
        ),
        month: monthNumber,
        id: ids[index],
        prayerTimes: times,
        saintsOfDay: day,
      };
    });
    console.log("trimmed", trimmed, ar, dateArray, scheduleSeparated);

    /*
      data: [
        {
          dateWeek: "19", // Выделять из текста "2 июля * Вторник * 2024 г."
          dayWeek: "Воскресенье", // Выделять из текста "2 июля * Вторник * 2024 г."
          id: "firstSunday",
          month: "05", // Выделять из текста "2 июля * Вторник * 2024 г."
          prayerTimes: "", //
          saintsOfDay: ""
        }
      ]
    */
    res.json({
      text: trimmed,
      ar,
      arMatch: dateArray,
      scheduleSeparated,
      data: scheduleSeparated.slice(1),
    });
  });

  // setTimeout(() => {
  // mammoth
  //   .convertToHtml({
  //     path: __dirname + `/uploads/${fileName}`,
  //   })
  //   .then(function (result) {
  //     var html = result.value; // The generated HTML
  //     var messages = result.messages; // Any messages, such as warnings during conversion
  //     res.send(html);
  //     console.log("html", html);
  //     console.log("messages", messages);
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
  // }, 2000);
});

app.use("/uploads", express.static("uploads"));
