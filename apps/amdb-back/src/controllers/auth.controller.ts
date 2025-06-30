import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

const ACCESS_TOKEN_SECRET = 'skoll';
const REFRESH_TOKEN_SECRET = 'hati';

const generateAccessToken = (user: any) =>
  jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (user: any) =>
  jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstName, lastName, email',
    [firstName, lastName, email, hashed]
  );
  res.status(201).json(rows[0]);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ accessToken });
};

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.sendStatus(204);
};
