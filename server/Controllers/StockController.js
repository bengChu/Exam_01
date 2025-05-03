// Controllers/StockController.js
const { v4: uuidv4 } = require('uuid');

class api_Response {
  constructor() {
    this.message = "";
    this.success = true;
    this.request_id = uuidv4();
    this.dataobj = null;
  }
}

exports.GetStockByProductId = (req, res) => {
  try {
    // Get db from app settings
    const db = req.app.get('db');
    
    // Now getting productId from request body
    console.log("req.body = ", req.body);
    const { productId } = req.body;
    
    if (!productId || isNaN(parseInt(productId))) {
      const response = new api_Response();
      response.success = false;
      response.message = "Invalid product ID";
      return res.status(400).json(response);
    }

    const numericProductId = parseInt(productId);

    // Find product
    const product = db.Product.find(p => p.Id === numericProductId);
    if (!product) {
      const response = new api_Response();
      response.success = false;
      response.message = "Product not found";
      return res.status(404).json(response);
    }

    // Find stock (default to 0 if not found)
    const stockEntry = db.Stock.find(s => s.ProductId === numericProductId);
    const stockAmount = stockEntry ? stockEntry.Amount : 0;

    // Prepare response
    const response = new api_Response();
    response.dataobj = {
      productdetail: {
        Id: product.Id,
        Name: product.Name,
        ImageUrl: product.ImageUrl,
        Price: product.Price
      },
      stock: stockAmount
    };

    return res.status(200).json({
      requestID: response.request_id,
      success: response.success,
      message: response.message,
      data: response.dataobj
    });

  } catch (error) {
    console.error("Error in GetStockByProductId:", error);
    const response = new api_Response();
    response.success = false;
    response.message = "Internal server error";
    return res.status(500).json(response);
  }
};