const express = require("express");
const app = express();
const port = 3000;

const patientDataRoute = require("./routes/employee/patientEntryRoute");
const patientEntiresRoute = require("./routes/employee/patientEntiresRoute");
const patientEntrySearch = require("./routes/search/patientEntrySearch");

const loginRoute = require("./routes/admin/loginRoute");
const adminLoginRoute = require("./routes/employee/adminLoginRoute");

const adminDispensaryDashRoute = require("./routes/admin/adminDispensaryDashRoute");
const adminEmployeesRoute = require("./routes/admin/adminEmployeesRoute")


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

app.use("/", patientDataRoute);
app.use("/", patientEntiresRoute);
app.use("/", patientEntrySearch);

app.use("/", loginRoute);
app.use("/", adminLoginRoute);

app.use("/", adminDispensaryDashRoute);
app.use("/", adminEmployeesRoute);

app.get("/", (req, res) => {
  res.send("connected");
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = server;
