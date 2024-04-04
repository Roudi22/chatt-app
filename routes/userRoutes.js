import express from 'express';
import { UserModel } from '../models/userModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const userRoutes = express.Router();
// Endpoint to create a new user
userRoutes.post('/api/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new UserModel({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
});

// Endpoint to login a user
userRoutes.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password }); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ id:user._id }, process.env.SECRET_KEY);

    res.status(200).json({message:"Logged in successfuly",user, token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});