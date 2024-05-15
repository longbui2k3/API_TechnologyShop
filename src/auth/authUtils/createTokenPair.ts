import JWT from 'jsonwebtoken';
import { Types } from 'mongoose';

export const createTokenPair = async (
  payload: { userId: Types.ObjectId; email: string },
  publicKey: string,
  privateKey: string,
) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2d',
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
