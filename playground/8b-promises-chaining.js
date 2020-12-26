const add = (a, b) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });

add(1, 2)
  .then((result) => {
    console.log(result);
    return add(result, 4);
  })
  .then((newResult) => console.log(newResult))
  .catch((error) => console.log(error));
