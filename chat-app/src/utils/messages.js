const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = ({ latitude, longitude }) => {
  const mapString = `https://google.com/maps?q=${latitude},${longitude}`;
  return generateMessage(mapString);
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
