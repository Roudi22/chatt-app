import {Schema, model} from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//* Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});
//* Define the user model
export const UserModel = model('User', userSchema);
