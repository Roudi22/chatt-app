import {Schema, model} from 'mongoose';

//* Define the channel schema
const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  messages: [
    {
      text: {
        type: String,
        required: true,
      },
      // the user who sent the message
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      
    }
  ]
});
export const ChannelModel = model('Channel', channelSchema);