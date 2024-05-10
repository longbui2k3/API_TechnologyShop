import nodemailer from 'nodemailer';
export class Email {
  email: string;
  OTP: string;
  constructor({ email, OTP }) {
    this.email = email;
    this.OTP = OTP;
  }
  async sendEmail() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    return await transporter.sendMail({
      from: process.env.AUTH_EMAIL, // sender address
      to: this.email, // list of receivers
      subject: 'Verify OTP ✅', // Subject line
      html: `
            <h3>Verify OTP ✅</h3>
            <p>Welcome!</p>
            <p>Here is your verification code: ${this.OTP} </p>
            <p>Please use this code to complete the authentication process.</p>`, // html body
    });
  }
}

