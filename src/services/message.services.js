import createHttpError from "http-errors";
import { MessageModel } from "../models";

export const createMessage = async (data) => {
  let newMsg = await MessageModel.create(data);
  if (!newMsg) {
    throw createHttpError.BadRequest("Oops... Something wents wrong");
  }
  return newMsg;
};

export const populateMessage = async (id) => {
  let message = MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });
  if (!message)
    throw createHttpError.BadRequest("Oops... Something wents wrong");
  return message;
};
export const getConvoMessages = async (covo_id) => {
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messages)
    throw createHttpError.BadRequest("Oops... Something wents wrong");
  return messages;
};
