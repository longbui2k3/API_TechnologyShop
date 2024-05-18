import JWT from 'jsonwebtoken';
import { Types } from 'mongoose';

export const createTokenPair = async (
  payload: { userId: Types.ObjectId; email: string; role: string },
  publicKey: string,
  privateKey: string,
) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
