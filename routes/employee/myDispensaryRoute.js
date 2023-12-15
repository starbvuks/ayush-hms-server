const express = require("express");
const router = express.Router();
const db = require("../../db/index");

router.get("/my-dispensary/:id", async (req, res) => {
  const dispensaryId = req.params.id;
  try {
    const result = await db.query(
      "SELECT * FROM dispensary WHERE dispensary_id = $1",
      [dispensaryId]
    );
    const dispensary = result.rows[0];
    res.json({ dispensary_name: dispensary.name });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
