import { config } from 'dotenv';
config();
import mongoose from 'mongoose';

const url = process.env.MONGO_DB_SIGNUP;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Mongo db is connected");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}



export default connectDB;