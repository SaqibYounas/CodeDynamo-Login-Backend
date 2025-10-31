import { compare } from 'bcrypt';
import User from '../../models/userSchema.js';
import { LOGIN_MESSAGES } from '../../constants/dataSave.js';

const login = async (user) => {
  const { email, password } = user;

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return LOGIN_MESSAGES.USER_NOT_FOUND;
  }

  if (!foundUser.password) {
    return LOGIN_MESSAGES.PASSWORD_NOT_SET;
  }

  const isMatch = await compare(password, foundUser.password);
  if (!isMatch) {
    return LOGIN_MESSAGES.PASSWORD_MISMATCH;
  }

  return foundUser;
};

export default login;
