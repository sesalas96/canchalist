import { Router } from 'express';
import * as historyController from '../controllers/6_historyController';

const router = Router();

router.post('/histories', historyController.createHistory);
router.get('/histories/:historyId', historyController.getHistoryById);
router.patch('/histories/:historyId', historyController.updateHistory);
router.delete('/histories/:historyId', historyController.deleteHistory);
router.post('/histories/:historyId/restore', historyController.restoreHistory);
router.get('/histories', historyController.listHistories);

export default router;
