const geocode = (address, callback) => {
  setTimeout(() => {
    const data = {
      latitude: 0,
      longitude: 0,
    };
    callback(data);
  }, 2000);
};

geocode("Leeds", (data) => console.log(data));

const add = (first, second, callback) => {
  setTimeout(() => {
    const sum = 1 + 4;
    callback(sum);
  }, 2000);
};

add(1, 4, (sum) => {
  console.log(sum); // Should print: 5
});
