const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");
const loadingText = "Loading...";

const preventDefault = (e) => (callback) => {
  e.preventDefault();
  callback();
};
weatherForm.addEventListener("submit", (e) =>
  preventDefault(e)(() => {
    const address = search.value;
    if (!address) {
      console.log("Error: Please submit a valid value");
      return;
    }
    messageOne.textContent = loadingText;
    messageTwo.textContent = "";
    fetch(`/weather?address=${address}`)
      .then((response) => {
        response
          .json()
          .then(({ data }) => {
            // Here
            console.log("here", data);
            messageOne.textContent = data.location;
            messageTwo.textContent = data.forecast;
          })
          .catch((error) => {
            console.log(("Error parsing JSON:", error.message));
          });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  })
);
