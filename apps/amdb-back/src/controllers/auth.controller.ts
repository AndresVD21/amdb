import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
  name: string;
}

interface User extends TokenPayload {
  firstName: string;
  lastName: string;
  password: string;
}

// TODO: move to environment variables
const ACCESS_TOKEN_SECRET = 'skoll';
const REFRESH_TOKEN_SECRET = 'hati';

const generateAccessToken = (user: User) =>
  jwt.sign({ id: user.id, email: user.email, name: user.firstname }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (user: User) =>
  jwt.sign({ id: user.id, email: user.email, name: user.firstname }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

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

  const name = user.firstname;

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ accessToken, name });
};

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, REFRESH_TOKEN_SECRET) as User;
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken, name: user.firstname });
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
