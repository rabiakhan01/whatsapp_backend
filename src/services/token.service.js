import { sign } from "../utils/token.util.js";

export const generateToken = async (payload, expiresIn, secret) => {
const token = await sign(payload, expiresIn, secret);
return token
}