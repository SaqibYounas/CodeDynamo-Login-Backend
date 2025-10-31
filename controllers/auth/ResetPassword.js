import User from '../../models/userSchema.js';
import { RESET_PASSWORD_MESSAGES } from '../../constants/resetPassword.js';

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: RESET_PASSWORD_MESSAGES.EMAIL_NOT_REGISTERED });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: RESET_PASSWORD_MESSAGES.PASSWORD_UPDATED });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: RESET_PASSWORD_MESSAGES.SERVER_ERROR });
  }
};
