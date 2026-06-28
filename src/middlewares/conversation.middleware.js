import createHttpError from "http-errors";
import { findUser } from "../services/user.service.js";
import { createConversation, doesConversationExists, populateConversation } from "../services/conversation.service.js";

export const create_open_conversation = async (req, res, next) => {
try {
    const sender_id = req?.user.userId;
    const body = req?.body;
    // check if reciever id is exists
    if(!body?.receiver_id){
        throw createHttpError.BadGateway("Something wents wrong")
    }
    // check if chat exits
    const receiver_id = body?.receiver_id
    const existed_conversation = await doesConversationExists({
        sender_id,
        receiver_id
    })
    if(existed_conversation) {
        res.json(existed_conversation)
    } else {
        const receiver = await findUser(receiver_id);
        const convoData = {
            name: receiver?.name,
            isGroup: false,
            users: [sender_id, receiver_id]
        }
    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(newConvo?._id, "users", "-password")
    res.status(200).json(populatedConvo)
    }
} catch (error) {
    return next(error)
}
}