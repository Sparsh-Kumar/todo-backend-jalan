import bcrypt from 'bcrypt';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

import { JwtPayload } from '@typings';

export const comparePassword = (
  inputPassword: string,
  accountPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, accountPassword);
};

export const createAccessToken = (payload: JwtPayload): string => {
  return jsonwebtoken.sign(payload, config.get('jwt.key'), { expiresIn: '1d' });
};

export const decodeAccessToken = (token: string): JwtPayload => {
  return jsonwebtoken.verify(token, config.get('jwt.key')) as JwtPayload;
};

export const encryptPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};
