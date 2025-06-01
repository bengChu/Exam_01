const { v4: uuidv4 } = require('uuid');

class api_Response {
  constructor() {
    this.message = "";
    this.success = true;
    this.request_id = uuidv4();
    this.dataobj = null;
  }
}


exports.GetAll = (req, res) => {
  const db = req.app.get('db'); // ดึง in-memory database

  const response = new api_Response();
  try {
    const productList = db.Product;
    response.dataobj = productList;
    response.message = "ดึงข้อมูลสินค้าสำเร็จ";
    res.json(productList); // หรือส่ง response ทั้งหมดด้วย: res.json(response);
  } catch (error) {
    response.success = false;
    response.message = "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า";
    response.dataobj = error.toString();
    res.status(500).json(response);
  }
};

exports.DeleteProduct = (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;

  const index = db.Product.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบสินค้า', success: false });
  }

  db.Product.splice(index, 1); // ลบสินค้า
  res.json({ message: 'ลบสินค้าสำเร็จ', success: true });
};

exports.GetById = (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;

  const product = db.Product.find(p => p.Id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: 'ไม่พบสินค้า', success: false });
  }

  res.json(product);
};

exports.UpdateProduct = (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  const { Name, Price, ImageUrl } = req.body;

  const product = db.Product.find(p => p.Id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: 'ไม่พบสินค้า', success: false });
  }

  product.Name = Name || product.Name;
  product.Price = Price || product.Price;
  product.ImageUrl = ImageUrl || product.ImageUrl;

  res.json({ message: 'อัปเดตสินค้าสำเร็จ', success: true });
};

exports.AddProduct = (req, res) => {

   console.log("เข้ามาใน server Add Product แล้ว");
  const db = req.app.get('db');
  const { Name, Price, ImageUrl } = req.body;

  if (!Name || !Price) {
    return res.status(400).json({
      message: "กรุณาระบุชื่อสินค้าและราคาสินค้า",
      success: false,
    });
  }

  // สร้าง Id ใหม่โดยใช้ลำดับต่อจากสินค้าเดิม
  const newId = db.Product.length > 0
    ? Math.max(...db.Product.map(p => p.Id)) + 1
    : 1;

  const newProduct = {
    Id: newId,
    Name,
    Price,
    ImageUrl: ImageUrl || null,
  };

  db.Product.push(newProduct);

  res.status(201).json({
    message: "เพิ่มสินค้าสำเร็จ",
    success: true,
    data: newProduct,
  });
};
