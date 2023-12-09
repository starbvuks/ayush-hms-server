const express = require("express");
const app = express();
const port = 3000;

const patientDataRoute = require("./routes/patientEntryRoute");
const patientEntiresRoute = require("./routes/patientEntiresRoute");
const distanceRoute = require("./routes/distanceRoute");
const loginRoute = require("./routes/loginRoute");
const adminLoginRoute = require("./routes/adminLoginRoute");
const adminDispensaryDashRoute = require("./routes/adminDispensaryDashRoute");

const patientEntrySearch = require("./routes/search/patientEntrySearch");

const db = require("./db/index");
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/patient-data", patientDataRoute);
app.use("/", patientEntiresRoute);
app.use("/", distanceRoute);
app.use("/", loginRoute);
app.use("/", adminLoginRoute);
app.use("/", adminDispensaryDashRoute);

app.use("/", patientEntrySearch);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/attendance", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT *, ST_AsText(location) as location_text FROM Attendance"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data" });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = server;
