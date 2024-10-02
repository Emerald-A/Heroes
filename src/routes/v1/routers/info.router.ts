import express from 'express';
import { sendComicData, sendAvatarData, userInformation } from '../../../controllers/info.controller';

const router = express.Router({ mergeParams: true });
router.get('/send-comic-data', sendComicData);
router.get('/send-avatar-data', sendAvatarData);
router.get('/get-user-data', userInformation);

export default router;
