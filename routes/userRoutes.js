import express from "express";
import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "../middleware/authMiddlware.js";
dotenv.config();

export const userRoutes = express.Router();
// Endpoint to create a new user
userRoutes.post("/api/user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to login a user
userRoutes.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required!" });
    }
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "username or password is not correct!" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY
    );

    res.status(200).json({ message: "Logged in successfuly", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to det all users
userRoutes.get("/api/users", authenticateJWT, async (req, res) => {
  try {
    const users = await UserModel.find();

    res.status(200).json({
      usersCount: users.length,
      success: true,
      users,
      message: "All users found",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
