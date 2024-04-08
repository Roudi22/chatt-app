import express from "express";
import { ChannelModel } from "../models/channelModel.js";
import { authenticateJWT } from "../middleware/authMiddlware.js";
import { io } from "../server.js";
export const channelRoutes = express.Router();

//* create a new channel
channelRoutes.put("/api/channel", authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    const newChannel = new ChannelModel({ name });
    // check if the channel already exists
    const channelExists = await ChannelModel.findOne({ name });
    if (channelExists) {
      return res.status(400).json({ message: "Channel already exists" });
    }
    await newChannel.save();
    // Meddela klienter att en ny kanal har skapats
    io.emit("channelCreated", { channel: newChannel });
    res
      .status(201)
      .json({ newChannel, message: "Channel created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to get a channel called "broadcast"
channelRoutes.get("/api/broadcast", async (req, res) => {
  try {
    const channel = await ChannelModel.findOne({ name: "broadcast" });
    res
      .status(200)
      .json({ messages: channel.messages, message: "Broadcast channel found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to send a message in the broadcast channel
channelRoutes.post("/api/broadcast", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Message is required" });
    }
    const channel = await ChannelModel.findOne({ name: "broadcast" });
    channel.messages.push({ text });
    await channel.save();
    // Meddela klienter att ett nytt meddelande har skickats
    io.emit("messageSent", { message: text });
    res.status(200).json({ channel, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to get all channels
channelRoutes.get("/api/channel", authenticateJWT, async (req, res) => {
  try {
    const channels = await ChannelModel.find();

    res.status(200).json({
      channelsCount: channels.length,
      success: true,
      channels,
      message: "All channels found",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all messages in a specific channel by id
channelRoutes.get("/api/channel/:id", authenticateJWT, async (req, res) => {
  try {
    const channel = await ChannelModel.findById(req.params.id);
    res.status(200).json({
      messagesCount: channel.messages.length,
      messages: channel.messages,
      message: "Messages found successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

channelRoutes.post("/api/channel/:id", authenticateJWT, async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ message: "User or message is Null" });
    }
    const channel = await ChannelModel.findById(req.params.id);
    channel.messages.push({ text, user: userId });
    await channel.save();
    res.status(200).json({ channel, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to delete a specific channel by id
channelRoutes.delete("/api/channel/:id", authenticateJWT, async (req, res) => {
  try {
    const channel = await ChannelModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ channel, message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
