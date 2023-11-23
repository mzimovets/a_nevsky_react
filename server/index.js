import express from "express";
const app = express();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("express on 4000");
});

app.get("/", (req, res) => {
  res.send("hello my dear");
});

app.get("/lf", (req, res) => {
  const a = 5;
  const b = 5;
  res.send({ a: a, b: b });
});
