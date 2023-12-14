const express = require("express");
const router = express.Router();
const db = require("../../db/index");

// Fetch list of dispensaries
router.get('/admin/dispensaries', async (req, res) => {
 try {
  const dispensaries = await db.query('SELECT * FROM dispensary');
  res.json(dispensaries.rows);
 } catch (error) {
  console.error(error);
  res.status(500).json({
    message: "An error occurred while fetching dispensaries",
  });
 }
});

// Fetch attendance data for a specific dispensary
router.get('/admin/dispensary/:id/attendance', async (req, res) => {
  try {
  const { id } = req.params;
  const { date } = req.query;
  const attendanceData = await db.query('SELECT attendance.*, employee.name FROM attendance JOIN employee ON attendance.employee_id = employee.employee_id WHERE attendance.dispensary_id = $1 AND DATE(attendance.entry_date) = $2', [id, date]);
  res.json(attendanceData.rows);
  } catch (error) {
  console.error(error);
  res.status(500).json({
    message: "An error occurred while fetching attendance data",
  });
  }
 });
 
 

router.get('/admin/dispensaries/search', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    let query = 'SELECT * FROM dispensary';
    let params = [];
 
    if (searchTerm) {
      query += ' WHERE name ILIKE $1 OR city ILIKE $1 OR district ILIKE $1 OR state ILIKE $1 OR pincode ILIKE $1';
      params.push(`%${searchTerm}%`);
    }
 
    const dispensaries = await db.query(query, params);
    res.json(dispensaries.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching dispensaries",
    });
  }
 });
 

module.exports = router;
