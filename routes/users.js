import express from "express";
import { signin, signup } from "../controllers/users.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({ min: 3 }),
  ],
  signin
);
router.post(
  "/signup",
  [
    check("firstName", "Name shoud be atleast 3 char ").isLength({ min: 3 }),
    check("email", "Enter valid email").isEmail(),
    check("password", "Password length should be 6 char ").isLength({
      min: 6,
    }),
  ],
  signup
);

export default router;
