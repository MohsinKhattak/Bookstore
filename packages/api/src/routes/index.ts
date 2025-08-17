import { Router } from 'express';
import userRoutes from './user.routes';
import bookRoutes from './book.routes';
import favoriteRoutes from './favorite.routes'
const router = Router();


router.use('/users', userRoutes);
router.use('/books', bookRoutes);
router.use('/favorite', favoriteRoutes);


export default router
