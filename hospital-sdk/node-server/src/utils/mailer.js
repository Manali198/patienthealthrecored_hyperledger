import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let transpoter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_APPPASSWORD, // generated ethereal password
  },
});

export default function ForgetPasswordMail(Maildata) {
  let __dirname = path.resolve();

  ejs.renderFile(
    path.join(__dirname + "/src/views/forgotPassword.ejs"),
    {
      username: Maildata.name,
      password: Maildata.newPassword,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      }

      let mailOptions = {
        from: "nnheo@example.com", // sender address
        to: Maildata.to, // list of receivers
        subject: `Forget Password`, // Subject line
        html: data, // html body
      };
      transpoter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return error;
        } else {
          return "Email sent:" + info.response;
        }
      });
    }
  );
}
