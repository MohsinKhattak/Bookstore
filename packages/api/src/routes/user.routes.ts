import { Router } from 'express';
import {
  register,
  login,
  logout,
  authenticateMe,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/authentication.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/authenticate', authenticate, authenticateMe);

export default router;
