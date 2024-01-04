const express = require("express");
const router = express.Router();
const db = require("../../db/index");

router.get(
  "/dispensaries/:dispensaryId/patient-entries/:timeframe",
  async (req, res, next) => {
    const dispensaryId = req.params.dispensaryId;
    const timeframe = req.params.timeframe;
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 7;
    let query = "";
    let values = [];

    if (dispensaryId !== "*") {
      values.push(dispensaryId);
    }

    if (timeframe === "today") {
      query =
        dispensaryId === "*"
          ? `SELECT * FROM patiententry WHERE DATE(entry_date) = CURRENT_DATE ORDER BY entry_date DESC`
          : `SELECT * FROM patiententry WHERE dispensary_id = $1 AND DATE(entry_date) = CURRENT_DATE ORDER BY entry_date DESC`;
    } else if (timeframe === "lastweek") {
      query =
        dispensaryId === "*"
          ? `SELECT * FROM patiententry WHERE entry_date >= NOW() - INTERVAL '7 days' ORDER BY entry_date DESC`
          : `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '7 days' ORDER BY entry_date DESC`;
    } else if (timeframe === "lastmonth") {
      query =
        dispensaryId === "*"
          ? `SELECT * FROM patiententry WHERE entry_date >= NOW() - INTERVAL '30 days' ORDER BY entry_date DESC`
          : `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '30 days' ORDER BY entry_date DESC`;
    } else if (timeframe === "lastyear") {
      query =
        dispensaryId === "*"
          ? `SELECT * FROM patiententry WHERE entry_date >= NOW() - INTERVAL '364 days' ORDER BY entry_date DESC`
          : `SELECT * FROM patiententry WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '364 days' ORDER BY entry_date DESC`;
    } else if (timeframe === "alltime") {
      query =
        dispensaryId === "*"
          ? `SELECT * FROM patiententry ORDER BY entry_date DESC`
          : `SELECT * FROM patiententry WHERE dispensary_id = $1 ORDER BY entry_date DESC`;
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

router.get(
  "/admin/dispensaries-entry/:dispensaryId/search",
  async (req, res) => {
    try {
      const { searchTerm, timeframe } = req.query;
      const dispensaryId = req.params.dispensaryId;
      let query = "SELECT * FROM patiententry";
      let params = [dispensaryId];

      if (timeframe) {
        if (timeframe === "today") {
          query +=
            " WHERE dispensary_id = $1 AND DATE(entry_date) = CURRENT_DATE";
        } else if (timeframe === "lastweek") {
          query +=
            " WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '7 days'";
        } else if (timeframe === "lastmonth") {
          query +=
            " WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '30 days'";
        } else if (timeframe === "lastyear") {
          query +=
            " WHERE dispensary_id = $1 AND entry_date >= NOW() - INTERVAL '364 days'";
        } else if (timeframe === "alltime") {
          // No additional condition needed
        }
      }

      if (searchTerm) {
        query += ` AND EXISTS (
        SELECT 1 FROM unnest(string_to_array($${
          params.length + 1
        }, ' ')) AS term
        WHERE tsv @@ phraseto_tsquery('english', term)
        )`;
        params.push(searchTerm);
      }

      const entries = await db.query(query, params);
      res.json(entries.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching patient entries",
      });
    }
  }
);

router.get("/admin/all-dispensaries-entry/search", async (req, res) => {
  try {
    const { searchTerm, timeframe } = req.query;
    let query = "SELECT * FROM patiententry";
    let params = [];

    if (timeframe) {
      if (timeframe === "today") {
        query += " WHERE DATE(entry_date) = CURRENT_DATE";
      } else if (timeframe === "lastweek") {
        query += " WHERE entry_date >= NOW() - INTERVAL '7 days'";
      } else if (timeframe === "lastmonth") {
        query += " WHERE entry_date >= NOW() - INTERVAL '30 days'";
      } else if (timeframe === "lastyear") {
        query += " WHERE entry_date >= NOW() - INTERVAL '364 days'";
      }
    }

    if (searchTerm) {
      query += ` AND EXISTS (
      SELECT 1 FROM unnest(string_to_array($${params.length + 1}, ' ')) AS term
      WHERE tsv @@ phraseto_tsquery('english', term)
      )`;
      params.push(searchTerm);
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
