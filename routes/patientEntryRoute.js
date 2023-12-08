const GeoPoint = require("geopoint");
const cron = require("node-cron");
const db = require("../db/index");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { patientData, employeeId, location } = req.body;

  // Save patient data
  const patientRecord = {
    ...patientData,
    employee_id: employeeId,
    entry_date: new Date(),
  };

  try {
    const insertText =
      "INSERT INTO PatientEntry(first_name, last_name, age, gender, adhaar_number, marital_status, diagnosis, treatment, other_info, entry_date, employee_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
    const insertValues = [
      patientRecord.first_name,
      patientRecord.last_name,
      patientRecord.age,
      patientRecord.gender,
      patientRecord.adhaar_number,
      patientRecord.marital_status,
      patientRecord.diagnosis,
      patientRecord.treatment,
      patientRecord.other_info,
      patientRecord.entry_date,
      employeeId,
    ];
    await db.query(insertText, insertValues);

    // Check if employee_id exists in Employee table
    const employeeCheckText = "SELECT * FROM Employee WHERE employee_id = $1";
    const employeeCheckValues = [employeeId];
    const employeeCheckResult = await db.query(
      employeeCheckText,
      employeeCheckValues
    );

    if (employeeCheckResult.rows.length === 0) {
      throw new Error(`Employee with id ${employeeId} does not exist`);
    }

    // Save attendance data
    const attendanceRecord = {
      employee_id: employeeId,
      entry_date: new Date(),
      location: `POINT(${location.longitude} ${location.latitude})`,
      distance: 0, // You can calculate the distance here if needed
    };

    const attendanceInsertText =
      "INSERT INTO Attendance(employee_id, entry_date, location, distance) VALUES($1, $2, ST_GeomFromText($3), $4)";
    const attendanceInsertValues = [
      attendanceRecord.employee_id,
      attendanceRecord.entry_date,
      attendanceRecord.location,
      attendanceRecord.distance,
    ];
    await db.query(attendanceInsertText, attendanceInsertValues);

    res.send({ message: "Patient data and attendance saved successfully" });
  } catch (error) {
    console.error(error);

    const insertText =
      "INSERT INTO PatientEntry(first_name, last_name, age, gender, adhaar_number, marital_status, diagnosis, treatment, other_info, entry_date, employee_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
    const insertValues = [
      patientRecord.first_name,
      patientRecord.last_name,
      patientRecord.age,
      patientRecord.gender,
      patientRecord.adhaar_number,
      patientRecord.marital_status,
      patientRecord.diagnosis,
      patientRecord.treatment,
      patientRecord.other_info,
      patientRecord.entry_date,
      employeeId,
    ];

    // Add this line to log the query and its values
    console.log("Query:", insertText);
    console.log("Values:", insertValues);

    res.status(500).send({ message: "An error occurred while saving data" });
  }
});

module.exports = router;
