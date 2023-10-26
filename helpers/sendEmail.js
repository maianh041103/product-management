const nodemailer = require('nodemailer');

module.exports.sendEmail = (res, email, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: res.locals.settingGeneral.email,
      pass: 'vacy wbcw jkxn lpox'
    }
  });

  var mailOptions = {
    from: res.locals.settingGeneral.email,
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