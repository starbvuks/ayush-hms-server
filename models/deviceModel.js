const db = require("../db");

async function getDeviceEntryById(deviceId) {
  try {
    const query = "SELECT * FROM device WHERE device_id = $1";
    const values = [deviceId];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null; // Device not found
    }

    return result.rows; // Return all rows matching the device_id
  } catch (error) {
    console.error("Error retrieving device entry:", error);
    return null;
  }
}

module.exports = {
  getDeviceEntryById,
};
