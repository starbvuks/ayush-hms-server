const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/patient-entries", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 7;
    const offset = (page - 1) * pageSize;

    const patientEntries = await db.query(
      "SELECT * FROM patiententry WHERE dispensary_id = $1 ORDER BY entry_id LIMIT $2 OFFSET $3",
      [req.query.dispensary_id, pageSize, offset]
    );

    res.json({
      patientEntries: patientEntries.rows,
      page: page,
      pageSize: pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching patient entries",
    });
  }
});

module.exports = router;
