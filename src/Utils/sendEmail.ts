import * as nodemailer from 'nodemailer';

interface EmailArguments {
  send_to: string;
  email_subject: string;
  email_body: string;
}

export async function sendEmail(args: EmailArguments): Promise<void> {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from: 'ADEEL HASSAN',
    to: args.send_to,
    subject: args.email_subject,
    html: args.email_body,
  };

  await transporter.sendMail(mailOptions, function (err: any, info: any) {
    if (err) {
      throw new Error(err);
    } else {
      console.log(info);
    }
  });
}
