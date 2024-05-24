import express from "express";
const app = express();
import bodyParser from "body-parser";

//--------NeDB---------
import Datastore from "nedb";

export const database = new Datastore("database.db");
database.loadDatabase();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + "/build"));

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
