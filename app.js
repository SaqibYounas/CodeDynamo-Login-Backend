import { config } from 'dotenv';
config();

import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/userConn.js";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import "./config/passport.js";

const app = express();
const { connection } = mongoose;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction
  ? ["https://code-dynamo-login-backend.vercel.app"]
  : ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use('/auth', authRoutes);

const PORT = isProduction ? process.env.PORT : 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${isProduction ? "production" : "development"} mode on port ${PORT}`);
  });
};

process.on('SIGINT', async () => {
  console.log('Shutting down the server...');
  await connection.close();
  process.exit(0);
});

export { app, startServer };
