const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ducdtgch18799@fpt.edu.vn",
    pass: "duc123123",
  },
})

const sendMail = (email, otp) => {
  var details = {
    from: "",
    to: email,
    subject: "The logging in OTP code of Learning Management System is: ",
    html: otp,
  }

  transporter.sendMail(details, function (error, data) {
    if (error) console.log(error)
    else console.log(data)
    console.log("OTP SENT")
  })
}

module.exports = sendMail
