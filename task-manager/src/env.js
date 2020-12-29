const logger = require("./logging/logger");
const dotenv = require("dotenv");

const nodeEnv = process.env.NODE_ENV;

if (!nodeEnv) {
  throw new Error("Node environment is not defined");
}
if (nodeEnv !== "production") {
  const mode = process.env.MODE ? `.${process.env.MODE}` : "";
  const path = `${__dirname}/../.env.${nodeEnv}${mode}`;
  dotenv.config({
    path,
  });
  logger(`Loading config from ${path}`);
}
