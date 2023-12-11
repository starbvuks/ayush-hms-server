const { getDistance } = require("geolib");

function calculateDistance(location, dispensaryLocation) {
  // Extract the longitude and latitude from the location object
  const userLocation = {
    latitude: parseFloat(location.latitude),
    longitude: parseFloat(location.longitude),
  };
  console.log(userLocation);

  // Parse the dispensaryLocation object into an object with latitude and longitude properties
  const dispensaryLocationObj = {
    latitude: parseFloat(dispensaryLocation.location.y),
    longitude: parseFloat(dispensaryLocation.location.x),
  };
  console.log(dispensaryLocationObj);

  // Calculate the distance using the Vincenty formula
  const distance = getDistance(userLocation, dispensaryLocationObj);
  console.log(distance);

  // Format the distance to meters with 2 decimal points
  const formattedDistance = distance / 1000;
  console.log(formattedDistance);

  return formattedDistance;
}

module.exports = { calculateDistance };
