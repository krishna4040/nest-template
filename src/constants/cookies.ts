import { CookieOptions } from 'express';

export const cookie_options: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const acess_token_sign_options = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
};

export const refresh_token_sign_options = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
};
