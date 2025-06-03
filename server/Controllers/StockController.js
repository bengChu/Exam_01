// Controllers/StockController.js
const { v4: uuidv4 } = require("uuid");

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
    const db = req.app.get("db");
    const { productId } = req.body;

    const response = new api_Response();

    // ตรวจสอบ productId ว่าถูกต้อง
    if (!productId || isNaN(parseInt(productId))) {
      response.success = false;
      response.message = "Invalid product ID";
      return res.status(400).json(response);
    }

    const numericProductId = parseInt(productId);

    // ค้นหาสินค้า
    const product = db.Product.find((p) => p.Id === numericProductId);
    if (!product) {
      response.success = false;
      response.message = "Product not found";
      return res.status(404).json(response);
    }

    const stockAmount = db.Stock
      .filter(s => s.ProductId === numericProductId)
      .reduce((sum, entry) => sum + entry.Amount, 0);

    // เตรียม response
    response.dataobj = {
      productdetail: {
        Id: product.Id,
        Name: product.Name,
        ImageUrl: product.ImageUrl,
        Price: product.Price,
      },
      stock: stockAmount,
    };

    response.message = "ดึงข้อมูลสินค้าพร้อมจำนวนคงเหลือสำเร็จ";

    return res.status(200).json({
      requestID: response.request_id,
      success: response.success,
      message: response.message,
      data: response.dataobj,
    });
  } catch (error) {
    console.error("Error in GetStockByProductId:", error);
    const response = new api_Response();
    response.success = false;
    response.message = "Internal server error";
    return res.status(500).json(response);
  }
};

exports.GetStockAll = (req, res) => {
  try {
    const db = req.app.get('db');
    const response = new api_Response();

    // join Stock กับ Product เพื่อเพิ่ม Product.Name
    const stockWithProductName = db.Stock.map((stock) => {
      const product = db.Product.find(p => p.Id === stock.ProductId);
      return {
        ...stock,
        ProductName: product ? product.Name : "Unknown"
      };
    });

    // sort ตาม Stock.Id
    stockWithProductName.sort((a, b) => a.Id - b.Id);

    response.dataobj = stockWithProductName;
    response.message = "ดึงรายการ stock ทั้งหมดสำเร็จ";

    return res.status(200).json({
      requestID: response.request_id,
      success: response.success,
      message: response.message,
      data: response.dataobj
    });
  } catch (error) {
    console.error("Error in GetStockAll:", error);
    const response = new api_Response();
    response.success = false;
    response.message = "Internal server error";
    response.dataobj = error.toString();

    return res.status(500).json(response);
  }
};
