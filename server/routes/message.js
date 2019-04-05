/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
// const nodemailer = require('nodemailer');

// const transport = {
//   host: process.env.MAIL_HOST,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// }

// const transporter = nodemailer.createTransport(transport);


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/send', async (req, res) => {
  try {
    const { mail } = req.body;
    const user = await User.findOne({
      _id: req.user._id,
    }).select({
      email: 1,
      _id: 0,
    });

    const msg = {
      to: mail.to,
      from: {
        email: 'local.market.catalog@gmail.com',
        name: `@${req.user.username} from Local Market`,
      },
      subject: mail.subject,
      text: mail.message,
      html: `<p>@${req.user.username} from Local Market:<br><br>Message:<br><br>${mail.message}. <br><br> Please reply to: <a href='mailto:${user.email}'} target="_blank" rel="noopener noreferrer">${user.email}</a></p><br><strong>Message from Local Market</strong>`,
    };
    const ms = await sgMail.send(msg); // statusMessage ='Accepted'
    const { statusCode } = ms[0];
    res.status(statusCode).json({
      message: 'Message Sent',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    res.json({
      error: `Failed to send Message${e.message}`,
    });
  }

  // statusMessage
  // transporter.verify((error, success) => {
  //   if (error) {
  //     res.json({
  //       error: 'Failed to send Message' + error.message
  //     })
  //   } else {
  //     console.log('Server is ready to take messages');
  //     transporter.sendMail(mail, (err, data) => {
  //       console.log('data',data)
  //       if (err) {
  //         res.json({
  //           error: 'Failed to send Message' + err.message
  //         })
  //       } else {
  //         res.json({
  //           message: 'Message Sent'
  //         })
  //       }
  //     })
  //   }
  // });
});

module.exports = router;
