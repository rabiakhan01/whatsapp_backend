import createHttpError from "http-errors";
import { createMessage, getConvoMessages } from "../services/message.services";

export const sendMessage = async (req, res, next) => {
    try {
        const user_id = req.user?.userId;
        const { message, convo_id, files} = req.body;
        if(!convo_id || (!message && !files)) {
            throw createHttpError.BadRequest("Convo id and message body is required.");
        }
        const msgData  = {
            sender: user_id,
            message,
            conversation: convo_id,
            files: files || [],
        }
        let newMessage = await createMessage(msgData);
        const populateMessage = await populateMessage(newMessage?._id)
    } catch (error) {
        next(error)
    }
};
export const getMessages = async (req, res, next) => {
    try {
        const convo_id = req.params.convo_id;
        if(!convo_id) {
            res.sendStatus(400)
        }
        const messages = await getConvoMessages(convo_id);
        return res.json(messages)
    } catch (error) {
        next(error)
    }
};
