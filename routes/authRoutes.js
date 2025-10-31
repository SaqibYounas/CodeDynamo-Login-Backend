import { Router } from "express";
import { checkEmail } from "../controllers/auth/CheckEmail.js";
import { resetPassword } from "../controllers/auth/ResetPassword.js";
import passport from "passport";
import { login, googleCallback } from "../controllers/auth/login_google.js";


const router = Router();

router.post("/login", login);
router.post("/check-email", checkEmail);
router.post("/reset-password", resetPassword);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);
export default router;
