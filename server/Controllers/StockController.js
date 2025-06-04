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

    const stockAmount = db.Stock.filter(
      (s) => s.ProductId === numericProductId
    ).reduce((sum, entry) => sum + entry.Amount, 0);

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
    const db = req.app.get("db");
    const response = new api_Response();

    // join Stock กับ Product เพื่อเพิ่ม Product.Name
    const stockWithProductName = db.Stock.map((stock) => {
      const product = db.Product.find((p) => p.Id === stock.ProductId);
      return {
        ...stock,
        ProductName: product ? product.Name : "Unknown",
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
      data: response.dataobj,
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

exports.DeleteStock = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;

  const index = db.Stock.findIndex((p) => p.Id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: "ไม่พบสต็อก", success: false });
  }

  db.Stock.splice(index, 1); // ลบสต็อก
  res.json({ message: "ลบสต็อกสำเร็จ", success: true });
};

exports.UpdateStock = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const { ProductId, Amount } = req.body;

  const stock = db.Stock.find((p) => p.Id === parseInt(id));
  if (!stock) {
    return res.status(404).json({ message: "ไม่พบสต็อก", success: false });
  }

  stock.ProductId = ProductId || stock.ProductId;
  stock.Amount = Amount || stock.Amount;

  res.json({ message: "อัปเดตสต็อกสำเร็จ", success: true });
};

exports.AddStock = (req, res) => {
  const db = req.app.get("db");
  let { ProductId, Amount } = req.body;

  if (ProductId === undefined || Amount === undefined) {
    return res.status(400).json({
      message: "กรุณาระบุ ProductId และ Amount",
      success: false,
    });
  }

  // แปลงเป็นตัวเลข (number)
  ProductId = parseInt(ProductId);
  Amount = parseFloat(Amount);

  if (isNaN(ProductId) || isNaN(Amount)) {
    return res.status(400).json({
      message: "ProductId และ Amount ต้องเป็นตัวเลข",
      success: false,
    });
  }

  const newId =
    db.Stock.length > 0 ? Math.max(...db.Stock.map((p) => p.Id)) + 1 : 1;

  const newStock = {
    Id: newId,
    ProductId,
    Amount,
  };

  db.Stock.push(newStock);

  res.status(201).json({
    message: "เพิ่ม stock สำเร็จ",
    success: true,
    data: newStock,
  });
};
