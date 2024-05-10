export interface RequestModel extends Request {
  keyStore?: Object;
  user?: { userId: string; email: string; role: string };
  refreshToken?: string;
}
