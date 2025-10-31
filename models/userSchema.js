import { Schema, model } from 'mongoose';
import hashPassword from "../middleware/hashPassword.js"
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    default: null
  },
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user",
  },
}, { timestamps: true });


userSchema.pre("save", hashPassword)
const User = model("User", userSchema, 'signup');

export default User;