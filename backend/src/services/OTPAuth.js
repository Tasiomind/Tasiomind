import * as OTPAuth from 'otpauth';
import config from 'config/app.config';

export const generateOTP = async (req, res) => {
  const base32_secret = 'JBSWY3DPEHPK3PXP';

  let totp = new OTPAuth.TOTP({
    issuer: 'config.appName',
    label: 'config.appName',
    algorithm: 'SHA1',
    digits: 6,
    secret: base32_secret,
  });

  let otpauth_url = totp.toString();

  res.status(200).json({
    base32: base32_secret,
    otpauth_url,
  });
};

// export const VerifyOTP = async (req, res) => {
//   try {
//     const { user_id, token } = req.body;

//     const message = "Token is invalid or user doesn't exist";
//     const user = await prisma.user.findUnique({ where: { id: user_id } });
//     if (!user) {
//       return res.status(401).json({
//         status: "fail",
//         message,
//       });
//     }

//     let totp = new OTPAuth.TOTP({
//       issuer: "codevoweb.com",
//       label: "CodevoWeb",
//       algorithm: "SHA1",
//       digits: 6,
//       secret: user.otp_base32!,
//     });

//     let delta = totp.validate({ token });

//     if (delta === null) {
//       return res.status(401).json({
//         status: "fail",
//         message,
//       });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: user_id },
//       data: {
//         otp_enabled: true,
//         otp_verified: true,
//       },
//     });

//     res.status(200).json({
//       otp_verified: true,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         otp_enabled: updatedUser.otp_enabled,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

// export const ValidateOTP = async (req, res) => {
//   try {
//     const { user_id, token } = req.body;
//     const user = await prisma.user.findUnique({ where: { id: user_id } });

//     const message = "Token is invalid or user doesn't exist";
//     if (!user) {
//       return res.status(401).json({
//         status: "fail",
//         message,
//       });
//     }
//     let totp = new OTPAuth.TOTP({
//       issuer: "codevoweb.com",
//       label: "CodevoWeb",
//       algorithm: "SHA1",
//       digits: 6,
//       secret: user.otp_base32!,
//     });

//     let delta = totp.validate({ token, window: 1 });

//     if (delta === null) {
//       return res.status(401).json({
//         status: "fail",
//         message,
//       });
//     }

//     res.status(200).json({
//       otp_valid: true,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

// export const DisableOTP = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     const user = await prisma.user.findUnique({ where: { id: user_id } });
//     if (!user) {
//       return res.status(401).json({
//         status: "fail",
//         message: "User doesn't exist",
//       });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: user_id },
//       data: {
//         otp_enabled: false,
//       },
//     });

//     res.status(200).json({
//       otp_disabled: true,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         otp_enabled: updatedUser.otp_enabled,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
