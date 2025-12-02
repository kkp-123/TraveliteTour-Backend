// otpGenerator

const generateOtp = () => {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}

module.exports = generateOtp;
