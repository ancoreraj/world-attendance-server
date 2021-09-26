const nodemailer = require('nodemailer')
const email = process.env.USER
const pass = process.env.USER_PASSWORD

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass
  }
})

const sendConfirmationEmail = (name, emailToSend, confirmationCode) => {

  transport.sendMail({
    from: email,
    to: emailToSend,
    subject: "Please confirm your Account",
    html: `
        <p>Hello ${name}</p>
        <h1><a href="http://localhost:5000/auth/confirmAccount/${confirmationCode}"> Click here</a><h1>
        </div>`,
  }).catch(err => console.log(err));
};

module.exports = sendConfirmationEmail;



