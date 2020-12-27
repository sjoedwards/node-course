const logger = require("../logging/logger");

const dropCollectionIfExists = async (model) => {
  const collectionExists = await model.exists();
  if (collectionExists) {
    await model.collection.drop();
    return logger(`Dropping collection ${model.modelName}`);
  } else {
    return;
  }
};

module.exports = dropCollectionIfExists;
