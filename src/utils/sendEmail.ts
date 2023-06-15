import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const user = process.env.EMAIL;
const password = process.env.PASSWORD;

interface EmailArguments {
  send_to: string;
  email_subject: string;
  email_body: string;
}

export async function sendEmail(args: EmailArguments): Promise<void> {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: password,
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
