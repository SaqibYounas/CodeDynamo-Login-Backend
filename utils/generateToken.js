import jwt from 'jsonwebtoken';
const { sign } = jwt;

const generateToken = (userData) => {
  let secretKey;

  switch (userData.role) {
    case "user":
      secretKey = process.env.SECRET_KEY;
      break;
    case "admin":
      secretKey = process.env.ADMIN_SECRET_KEY;
      break;
    default:
      throw new Error("Invalid user role");
  }

  return sign(userData, secretKey, { expiresIn: "6h" });
};


export default generateToken;