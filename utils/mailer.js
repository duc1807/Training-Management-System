const nodemailer = require("nodemailer");

// Create the transporter with service configuration
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: 'Gmail',
  port: 465,
  auth: {
    user: "vuatrochoi.theblue@gmail.com",
    pass: "123binh789",
  },
})

// Create function sendMail that receive email and otp code
const sendMail = (email, otp) => {
  var details = {
    from: "vuatrochoi.theblue@gmail.com", // The mail used to send the OTP code
    to: email, // The receiver email
    subject: "Ma otp cua ban la : ",  // Content of the mail
    html: otp,
  }
  // Send mail
  transporter.sendMail(details, function (error, data) {
    if (error) console.log(error)
    else console.log(data)
    console.log("OTP SENT")
  })
}

module.exports = sendMail
