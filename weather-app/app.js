require("dotenv/config");

console.log("Starting");
console.log(process.env.WEATHER_STACK_KEY);

setTimeout(() => {
  console.log("Timer");
}, 1000);

setTimeout(() => {
  console.log("0 second timer");
}, 0);

console.log("Stopping");
