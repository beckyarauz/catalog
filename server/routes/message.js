const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const creds = {
  USER: process.env.MAIL_USER,
  PASS: process.env.MAIL_PASS,
}
const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

const transporter = nodemailer.createTransport(transport);

router.post('/send',(req, res, next) => {
  console.log(req.body.mail)
  let mail = req.body.mail;

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
      transporter.sendMail(mail, (err, data) => {
        console.log('data',data)
        if (err) {
          res.json({
            error: 'Failed to send Message' + err.message
          })
        } else {
          res.json({
            message: 'Message Sent'
          })
        }
      })
    }
  });



  // res.status(200).json({message:'Message Sent'})
});

module.exports = router;
