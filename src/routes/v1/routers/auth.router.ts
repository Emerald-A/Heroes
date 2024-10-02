import express from 'express';
import { validateChannels as vcd } from '../../../middlewares/header.mw';
import { register, login, logout } from '../../../controllers/auth.controller';

const router = express.Router({ mergeParams: true });

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

export default router;
