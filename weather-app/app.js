require("dotenv/config");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const location = process.argv[2];

if (!location) {
  console.log("Please provide an address");
  return;
}

geocode(location, (error, { latitude, longitude, location } = {}) => {
  if (error) {
    console.log(error);
    return;
  }
  forecast(latitude, longitude, (error, forecastData) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(location);
    console.log(forecastData);
  });
});
