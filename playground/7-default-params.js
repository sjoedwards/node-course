const greeter = (name = "User", age) => {
  console.log(`Hello ${name}, you are ${age} years old`);
};

const transaction = (type, { label, stock = 0 } = {}) => {
  console.log(type, label, stock);
};

transaction();

greeter("Sam", 99);
