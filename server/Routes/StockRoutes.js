const express = require('express');
const router = express.Router();
const stockController = require('../Controllers/StockController');
const verifyToken = require('../middleware/verifyToken');

router.post('/getstockbyproductid', verifyToken, stockController.GetStockByProductId);
router.post('/getstockall', verifyToken, stockController.GetStockAll);

module.exports = router;