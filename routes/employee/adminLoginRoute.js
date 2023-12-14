const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const db = require("../../db/index");

router.post("/admin/login", async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if username exists in the database
    const user = await db.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    // Compare the password with the password stored in the database
    const isPasswordValid = password === user.rows[0].password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the credentials are valid, return success and admin_id and role
    res.json({
      message: "Logged in successfully",
      admin_id: user.rows[0].admin_id,
      role: user.rows[0].role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});

module.exports = router;
