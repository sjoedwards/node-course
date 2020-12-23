const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");
require("dotenv/config");

const app = express();
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(path.join(publicDirectoryPath)));

// Define handlebars as the view engine
app.set("view engine", "hbs");

// Define handlebars custom view directory
const viewsPath = path.join(__dirname, "..//templates/views");
app.set("views", viewsPath);

// Register partials
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);

// Home page
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Sam Edwards",
  });
});

// Application paths
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Sam Edwards",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "This is the help message",
    title: "Help",
    name: "Sam Edwards",
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({ error: "You must provide an address" });
  }

  return geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return createError(res, "Unable to get location information");
    }
    forecast(latitude, longitude, (error, forecast) => {
      if (error) {
        return createError(res, `Unable to get forecast for ${location}`);
      } else {
        createResponse(res, { forecast, location, address });
      }
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  return res.send({ products: {} });
});

// 404

app.get("/help/*", (req, res) => {
  res.render("404", {
    message: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    message: "Page not found",
    name: "Sam Edwards",
  });
});

const createError = (res, message) => res.send({ error: message });
const createResponse = (res, data) => res.send({ data });

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
