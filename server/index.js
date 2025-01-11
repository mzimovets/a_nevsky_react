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
    // console.log(data);

    const trimmed = data.replace(
      "Расписание Богослужений\nв Александр-Невском кафедральном соборе\nДень недели, устав\nСвятые дня",
      ""
    );
    const ar = trimmed.split(/\d\s.+г\./);
    console.log("trimmed", trimmed, ar);
    res.json({ text: trimmed });
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
