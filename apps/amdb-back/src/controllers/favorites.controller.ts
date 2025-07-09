import { Request, Response } from 'express';
import { pool } from '../db';

// Add anime/manga to favorites
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // From auth middleware
    const { malId, type, status, image_url, title } = req.body;

    const { rows } = await pool.query(
      'INSERT INTO favorites (user_id, mal_id, type, status, image_url, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, malId, type, status, image_url, title]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

// Update favorite status
export const updateFavoriteStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { malId } = req.params;
    const { status } = req.body;

    const { rows } = await pool.query(
      'UPDATE favorites SET status = $1 WHERE user_id = $2 AND mal_id = $3 RETURNING *',
      [status, userId, malId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ message: 'Error updating favorite status' });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { malId } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND mal_id = $2',
      [userId, malId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

// Get user's favorites
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { rows } = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Error getting favorites' });
  }
};

// Check if item is in favorites and get its status
export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { malId } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND mal_id = $2',
      [userId, malId]
    );

    res.json({
      isFavorite: rows.length > 0,
      status: rows[0]?.status || null,
      imageUrl: rows[0]?.image_url || null
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ message: 'Error checking favorite' });
  }
};
