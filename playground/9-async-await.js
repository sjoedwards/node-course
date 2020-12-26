const { reject } = require("lodash");

const add = (a, b) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if ((a < 0) | (b < 0)) {
        reject("numbers must be non-negative");
      } else {
        resolve(a + b);
      }
    }, 2000);
  });

// No need to declare global scope variables as in promise chains when using async await

const doWork = async () => {
  const sum = await add(1, -99);
  const sum2 = await add(sum, 50);
  return add(sum2, 3);
};

doWork()
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
