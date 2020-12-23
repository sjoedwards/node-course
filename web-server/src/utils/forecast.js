const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_STACK_KEY}&query=${long},${lat}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to call weather API");
    } else if (body.error) {
      callback("Unable to find location");
    } else {
      const { temperature, feelslike, weather_descriptions } = body.current;
      callback(
        undefined,
        `${weather_descriptions}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`
      );
    }
  });
};

module.exports = forecast;
