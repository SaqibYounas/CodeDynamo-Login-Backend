import { config } from 'dotenv';
config();

import express, { json } from "express";
import mongoose from "mongoose";
import connectDB from "./config/userConn.js";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';


import "./config/passport.js";

const app = express();
const { connection } = mongoose;

app.use(json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.json()); // ✅ required for parsing JSON body
app.use(express.urlencoded({ extended: true })); // optional for form data
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/auth', authRoutes);

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};


process.on('SIGINT', async () => {
  console.log('Shutting down the server...');
  await connection.close();
  process.exit(0);
});

export default startServer;