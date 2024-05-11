import { ClientSession, Connection } from 'mongoose';
import { startSession } from 'mongoose';

export { startSession } from 'mongoose';

export const transaction = async (
  connection: Connection,
  fn: (session: ClientSession) => Promise<Object>,
) => {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    const result = await fn(session);
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.endSession();
    throw err;
  }
};
