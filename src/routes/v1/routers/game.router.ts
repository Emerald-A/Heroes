import express from 'express';
import {
  saveGameInfo,
  leaderboard,
  prizeHistory,
  displayGameHistory,
  retrieveGameInfo,
} from '../../../controllers/game.controller';

const router = express.Router();

router.post('/save-info', saveGameInfo);
router.get('/leaderboard', leaderboard);
router.post('/prize-history', prizeHistory);
router.get('/display-game-history', displayGameHistory);
router.get('/get-data', retrieveGameInfo);

export default router;
