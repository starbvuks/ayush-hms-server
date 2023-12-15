const express = require("express");
const router = express.Router();
const db = require("../../db/index");

router.get(
  "/dispensaries/:dispensaryId/patient-entries",
  async (req, res, next) => {
    const dispensaryId = req.params.dispensaryId;
    try {
      const entries = await db.query(
        `SELECT * FROM patiententry WHERE dispensary_id = $1 ORDER BY entry_date DESC`,
        [dispensaryId]
      );
      res.json(entries.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching patient entries",
      });
    }
  }
);

router.get(
  "/dispensaries/:dispensaryId/patient-entries/:timeframe",
  async (req, res, next) => {
    const dispensaryId = req.params.dispensaryId;
    const timeframe = req.params.timeframe;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 7;
    let query = "";
    let values = [dispensaryId];

    if (timeframe === "today") {
      query = `SELECT * FROM patiententry WHERE dispensary_id = $1 AND DATE(entry_date) = CURRENT_DATE ORDER BY entry_date DESC`;
    } else if (timeframe === "lastweek") {
      query = `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '7 days' ORDER BY entry_date DESC`;
    } else if (timeframe === "lastmonth") {
      query = `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '1 month' ORDER BY entry_date DESC`;
    } else if (timeframe === "lastyear") {
      query = `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '1 year' ORDER BY entry_date DESC`;
    } else if (timeframe === "alltime") {
      query = `SELECT * FROM patiententry WHERE dispensary_id = $1 ORDER BY entry_date DESC`;
    }

    try {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ${pageSize} OFFSET ${offset}`;
      const entries = await db.query(query, values);
      res.json(entries.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching patient entries",
      });
    }
  }
);

router.get("/admin/dispensaries-entry/search", async (req, res) => {
  try {
    const { searchTerm, timeframe } = req.query;
    let query = "SELECT * FROM patiententry";
    let params = [];

    if (searchTerm) {
      query +=
        " WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR diagnosis ILIKE $1 OR treatment ILIKE $1 OR other_info ILIKE $1";
      params.push(`%${searchTerm}%`);
    }

    if (timeframe) {
      if (timeframe === "today") {
        query += " AND DATE(entry_date) = CURRENT_DATE";
      } else if (timeframe === "lastweek") {
        query += " AND entry_date >= NOW() - INTERVAL '7 days'";
      } else if (timeframe === "lastmonth") {
        query += " AND entry_date >= NOW() - INTERVAL '1 month'";
      } else if (timeframe === "lastyear") {
        query += " AND entry_date >= NOW() - INTERVAL '1 year'";
      } else if (timeframe === "alltime") {
        // No additional condition needed
      }
    }

    const entries = await db.query(query, params);
    res.json(entries.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching patient entries",
    });
  }
});

module.exports = router;
