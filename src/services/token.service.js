import { sign, verify } from "../utils/token.util.js";

export const generateToken = async (payload, expiresIn, secret) => {
  const token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token, secret) => {
  try {
    const decoded = await verify(token, secret);
    return decoded;
  } catch (error) {
    throw error;
  }
};
