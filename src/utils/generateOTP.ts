export function generateOTP(num: number): string {
  let OTP: string = '';
  for (let i = 0; i < num; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    OTP += randomDigit;
  }
  return OTP;
};
