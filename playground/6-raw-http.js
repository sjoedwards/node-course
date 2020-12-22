const https = require("http");

const long = -73;
const lat = 40;
const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_STACK_KEY}&query=${long},${lat}`;
console.log("🚀 ~ file: 6-raw-http.js ~ line 6 ~ url", url);

const request = https.request(url, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data = data + chunk.toString();
  });

  response.on("end", () => {
    const body = JSON.parse(data);
    console.log(
      "🚀 ~ file: 6-raw-http.js ~ line 16 ~ response.on ~ body",
      body
    );
  });

  request.on("error", (error) => {
    console.log(error);
  });
});

request.end();
