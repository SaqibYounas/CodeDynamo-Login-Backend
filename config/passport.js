import { config } from 'dotenv';
config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userSchema.js';
import { MESSAGES } from '../constants/authMessage.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8004/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(MESSAGES.GOOGLE_PROFILE_LOG, profile);

        const email = profile.emails[0].value.toLowerCase();

        const existingUser = await User.findOne({
          $or: [{ email: email }, { googleId: profile.id }],
        });

        if (existingUser) {
          console.log(MESSAGES.USER_FOUND, existingUser);
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          isVerified: profile.emails[0].verified || false,
        });

        const savedUser = await newUser.save();
        console.log(MESSAGES.NEW_USER_SAVED, savedUser);

        return done(null, savedUser);
      } catch (err) {
        console.error(MESSAGES.STRATEGY_ERROR, err);
        return done(err, null);
      }
    }
  )
);
