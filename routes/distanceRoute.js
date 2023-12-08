const express = require("express");
const router = express.Router();
const { calculateDistance } = require("../utils/functions");
const { getDistance } = require("geolib");

router.get("/distance", (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;

  // Convert the coordinates to numbers
  const lat1Num = parseFloat(lat1);
  const lon1Num = parseFloat(lon1);
  const lat2Num = parseFloat(lat2);
  const lon2Num = parseFloat(lon2);

  // Calculate the distance using the Vincenty formula
  const distance = getDistance(
    { latitude: lat1Num, longitude: lon1Num },
    { latitude: lat2Num, longitude: lon2Num }
  );

  // Format the distance to meters with 2 decimal points
  const formattedDistance = (distance / 1000).toFixed(2);

  // Return the formatted distance with the unit
  res.json({ distance: `${formattedDistance} meters` });
});

module.exports = router;

// http://localhost:3000/distance?lat1=17.585044&lon1=78.986671&lat2=17.385074&lon2=78.486671
