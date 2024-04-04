import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from './middleware/authMiddlware.js';
import { connectDB } from './db.js';
import { userRoutes } from './routes/userRoutes.js';
import { channelRoutes } from './routes/channelRoutes.js';
const app = express();
app.use(bodyParser.json());


app.use(userRoutes, channelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
    connectDB();
});