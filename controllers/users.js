import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { check, validationResult } from "express-validator";

export const signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User Doen't exist.." });
    const isPasswordCurrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCurrect)
      return res.status(400).json({ message: "invalid Cradintial" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "12h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (e) {
    res.status(500).json({ message: "something went wrong " });
  }
};

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User Already exist.." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password don't match" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "12h",
    });

    res.status(200).json({ result, token });
  } catch (e) {
    res.status(500).json({ message: "something went wrong " });
  }
};
