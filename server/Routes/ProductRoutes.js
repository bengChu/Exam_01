const multer = require('multer');
const path = require('path');

const express = require('express');
const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const productController = require('../Controllers/ProductController');

const verifyToken = require('../middleware/verifyToken');

// Add this new route
router.post('/upload-image', verifyToken, upload.single('productImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const imageUrl = `/public/images/products/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl: imageUrl,
    message: 'Image uploaded successfully'
  });
});

router.post('/getproductall', verifyToken, productController.GetAll);
router.delete('/:id', verifyToken, productController.DeleteProduct);
router.post('/:id', verifyToken, productController.GetById);
router.put('/:id', productController.UpdateProduct);


module.exports = router;