import mongoose, { Collection } from "mongoose";

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
        ref: "UserModal",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModal",
    },
    admin: {
      type: ObjectId,
      ref: "UserModal",
    },
  },
  {
    Collection: "converation",
    timestamps: true,
  },
);

const ConversationModal =
  mongoose.models.conversationModal || mongoose.model("ConversationModal", conversationSchema);

export default ConversationModal;
