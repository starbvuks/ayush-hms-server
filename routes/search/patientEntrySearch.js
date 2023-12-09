const express = require("express");
const router = express.Router();
const db = require("../../db/index");

router.get("/patient-entries/search", async (req, res, next) => {
  const { searchTerm } = req.query;
  try {
    const entries = await db.query(
      `SELECT * FROM patiententry WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR diagnosis ILIKE $1 ORDER BY entry_date DESC`,
      [`%${searchTerm}%`]
    );
    res.json(entries.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
