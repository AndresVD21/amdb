import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import favoritesRoutes from './routes/favorites.routes';

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/favorites', favoritesRoutes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
