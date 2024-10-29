const express = require('express');
const authMiddleware = require('../middlewares/Auth-Middleware');
const userController = require('../controllers/User-Controller');

const router = express.Router();

router.get('/all', userController.allAccess);
router.get('/', userController.userBoard);
router.get('/admin_board', [authMiddleware.verifyToken, authMiddleware.checkAdmin], userController.adminBoard);


module.exports = router;
