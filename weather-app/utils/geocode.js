const request = require("request");

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services");
    } else if (body.features.length === 0) {
      callback("Unable to try location. Try another search");
    } else {
      const [latitude, longitude] = body.features[0].center;
      const { place_name: location } = body.features[0];
      callback(undefined, { latitude, longitude, location });
    }
  });
};

module.exports = geocode;
