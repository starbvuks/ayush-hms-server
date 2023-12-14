const express = require("express");
const router = express.Router();
const db = require("../../db/index");

router.get("/admin/dashboard", async (req, res) => {
  try {
    const totalDispensaries = await db.query("SELECT COUNT(*) FROM dispensary");
    const employeesPerDispensary = await db.query(
      "SELECT registered_dispensary, COUNT(*) FROM employee GROUP BY registered_dispensary"
    );
    const mostEntriesDay = await db.query(
      "SELECT entry_date, COUNT(*) FROM patiententry GROUP BY entry_date ORDER BY COUNT(*) DESC LIMIT 1"
    );
    const mostActiveDispensary = await db.query(
      "SELECT dispensary_id, COUNT(*) FROM patiententry GROUP BY dispensary_id ORDER BY COUNT(*) DESC LIMIT 1"
    );
    const totalEntries = await db.query(
      "SELECT dispensary_id, COUNT(*) FROM patiententry GROUP BY dispensary_id"
    );

    res.json({
      totalDispensaries: totalDispensaries.rows[0].count,
      employeesPerDispensary: employeesPerDispensary.rows,
      mostEntriesDay: mostEntriesDay.rows[0],
      mostActiveDispensary: mostActiveDispensary.rows[0],
      totalEntries: totalEntries.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching admin dashboard data",
    });
  }
});

module.exports = router;
