const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: 'Gmail',
  port: 465,
  auth: {
    user: "vuatrochoi.theblue@gmail.com",
    pass: "123binh789",
  },
})

const sendMail = (email, otp) => {
  var details = {
    from: "vuatrochoi.theblue@gmail.com",
    to: email,
    subject: "Ma otp cua gui cho binh dep trai la : ",
    html: otp,
  }

  transporter.sendMail(details, function (error, data) {
    if (error) console.log(error)
    else console.log(data)
    console.log("OTP SENT")
  })
}

module.exports = sendMail
