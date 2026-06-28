import mongoose from "mongoose";
import pkg from 'mongoose';
const { Collection } = pkg;

const { ObjectId } = mongoose.Schema.Types;
const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation is required"],
      trim: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModel",
    },
    admin: {
      type: ObjectId,
      ref: "UserModel",
    },
  },
  {
    Collection: "conversation",
    timestamps: true,
  },
);

const ConversationModel =
  mongoose.models.ConversationModel || mongoose.model("ConversationModel", conversationSchema);

export default ConversationModel;
