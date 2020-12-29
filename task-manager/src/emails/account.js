const apiKey = process.env.SENDGRID_API_KEY;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(apiKey);

const prepareUserEmail = (email) => (text, subject) =>
  sgMail.send({
    to: email,
    from: "samuel.j.o.edwards@gmail.com",
    subject,
    text,
  });

const sendWelcomeEmail = (email, name) => {
  const subject = "Thanks for joining!";
  const text = `Welcome to the app, ${name}, let me know how you get on`;
  const sendEmail = prepareUserEmail(email);
  sendEmail(text, subject);
};

const sendCancellationEmail = (email, name) => {
  const subject = "Sorry to see you go!";
  const text = `Sorry to see you go, ${name}!`;
  const sendEmail = prepareUserEmail(email);
  sendEmail(text, subject);
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
