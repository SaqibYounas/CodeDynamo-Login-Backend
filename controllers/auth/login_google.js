import logins from "./loginDataSave.js";
import generateToken from "../../utils/generateToken.js";
import { STATUS_CODES } from "../../constants/statusCodes.js";
import { LOGIN_MESSAGES, LOGS } from "../../constants/loginMessage.js";

export const login = async (req, res) => {
  try {
    const response = await logins(req.body);

    if (
      response === LOGIN_MESSAGES.PASSWORD_MISMATCH ||
      response === LOGIN_MESSAGES.EMAIL_NOT_FOUND ||
      response === LOGIN_MESSAGES.NO_ACCOUNT
    ) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: response });
    }

    if (response === LOGIN_MESSAGES.PASSWORD_NOT_SET) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: LOGIN_MESSAGES.PASSWORD_NOT_SET });
    }

    const token = generateToken({
      id: response._id,
      role: response.role,
      name: response.name,
      email: response.email,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 6 * 60 * 60 * 1000,
    };

    if (response.role === "user") {
      res.cookie("token", token, cookieOptions);
    } else if (response.role === "admin") {
      res.cookie("admin_token", token, cookieOptions);
    }

    console.log("User Role:", response.role);
    return res
      .status(STATUS_CODES.OK)
      .json({ message: LOGIN_MESSAGES.SUCCESS, role: response.role });
  } catch (err) {
    console.error(LOGS.LOGIN_ERROR, err);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: LOGIN_MESSAGES.SERVER_ERROR });
  }
};

export const googleCallback = (req, res) => {
  try {
    if (!req.user)
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: LOGIN_MESSAGES.USER_NOT_FOUND });

    const token = generateToken({
      id: req.user._id,
      role: req.user.role,
      name: req.user.name,
      email: req.user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/user/dashboard");
  } catch (err) {
    console.error(LOGS.GOOGLE_CALLBACK_ERROR, err);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ error: LOGIN_MESSAGES.GOOGLE_FAILED });
  }
};
