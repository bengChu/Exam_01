const express = require('express');
const router = express.Router();
const stockController = require('../Controllers/StockController');

router.post('/getstockbyproductid', stockController.GetStockByProductId);

module.exports = router;