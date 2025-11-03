import User from "../../models/userSchema.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { EMAIL_MESSAGES, LOGS } from "../../constants/authMessage.js";

export const checkEmail = async (req, res) => {
  try {
    const { emailkey } = req.body;

    const user = await User.findOne({ email: emailkey });
    console.log(user)
    if (!user) {
      return res.status(STATUS_CODES.OK).json({
        exists: false,
        message: EMAIL_MESSAGES.NOT_REGISTERED,
      });
    }

    if (user.googleId) {
      return res.status(STATUS_CODES.OK).json({
        exists: true,
        googleAccount: true,
        message: EMAIL_MESSAGES.GOOGLE_ACCOUNT,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      exists: true,
      googleAccount: false,
      message: EMAIL_MESSAGES.FOUND,
    });
  } catch (error) {
    console.error(LOGS.CHECK_EMAIL_ERROR, error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      exists: false,
      message: EMAIL_MESSAGES.SERVER_ERROR,
    });
  }
};
