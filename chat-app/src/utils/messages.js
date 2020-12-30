const generateMessage = (text, username) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = ({ latitude, longitude }, username) => {
  const mapString = `https://google.com/maps?q=${latitude},${longitude}`;
  return generateMessage(username, mapString);
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
