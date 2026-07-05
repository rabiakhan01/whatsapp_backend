import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExists = async ({ sender_id, receiver_id }) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (!convos) {
    throw createHttpError.BadRequest("Opps....Something wents wrong");
  }
  convos = UserModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });
  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo) {
    throw createHttpError.BadRequest("Opps....Something wents wrong");
  } else return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldNotToPopulate,
) => {
  const populatedConvo = ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldNotToPopulate,
  );
  if (!populatedConvo) {
    throw createHttpError.BadRequest("Opps....Something wents wrong");
  }
  return populatedConvo;
};

export const getConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((error) => {
      throw createHttpError.BadRequest("Ooops... Something wents wrong");
    });

  return conversations;
};
