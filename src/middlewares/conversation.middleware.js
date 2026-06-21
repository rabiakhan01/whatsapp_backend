import createHttpError from "http-errors";

export const create_open_conversation = async (req, res, next) => {
try {
    const sender_id = req?.user.userId;
    const body = req?.body;
    // check if reciever id is exists
    if(!body?.receiver_id){
        throw createHttpError.BadGateway("Something wents wrong")
    }
} catch (error) {
    return next(error)
}
}