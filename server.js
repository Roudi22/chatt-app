import express from "express";
import bodyParser from "body-parser";

import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { channelRoutes } from "./routes/channelRoutes.js";
const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
export const io = new Server(server);

app.use(userRoutes, channelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
