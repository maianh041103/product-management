const nodemailer = require('nodemailer');

module.exports.sendEmail = (email, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nguyenmaianh041103@gmail.com',
      pass: 'vacy wbcw jkxn lpox'
    }
  });

  var mailOptions = {
    from: 'nguyenmaianh041103@gmail.com',
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}