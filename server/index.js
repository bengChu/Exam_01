// index.js
const express = require('express');
const app = express();
const PORT = 3001;//เปลี่ยนเป็น3001 จะได้ไม่ซ้ำกับfrontend react ที่ใช้3000
const path = require('path');

const cors = require('cors');


// Add body parser middleware
app.use(express.json()); // This is crucial for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const stockRoutes = require('./Routes/StockRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const authRoutes = require('./Routes/AuthRoutes');


//////////////in memory database zone START //////////////////////////////
const db = {
  Product: [
    {
      Id: 1,
      Name: "sku1",
      ImageUrl:
        "/public/images/products/productImage-1744309085714-853373604.jpg",
      Price: 250,
    },
    {
      Id: 2,
      Name: "sku2",
      ImageUrl:
        "/public/images/products/productImage-1744309111506-907809460.jpg",
      Price: 350,
    },
  ],
  Stock: [
    //ความหมายคือ Id=pk, productนึงมีของเข้าออก(+/-) ลำดับตามId
    //อย่างข้อมูลนี้ ProductId=1 มีstock=10-7+25=28ชิ้น, ProductId=2 มีstock=5+11=16ชิ้น
    { Id: 1, ProductId: 1, Amount: 10 },
    { Id: 2, ProductId: 1, Amount: -7 },
    { Id: 3, ProductId: 2, Amount: 5 },
    { Id: 4, ProductId: 1, Amount: 25 },
    { Id: 5, ProductId: 2, Amount: 11 },
  ],
  User: [
    { Id: "beng01", 
      Password: "$2b$10$3pHQI66/CbQPWniymvVIMeG3wmphM1F0lD5FCD1fzI5jtxDl2EQQW"//"123456" 
    },
    { Id: "beng02", 
      Password: "$2b$10$5PAta2hc.uNHCVXc6jZx2OuwjXUF.BOzI5QohC4dfo7VGDUtA/gRK"//"789012" 
    },
  ],
};
  
  // Make db accessible to controllers
  app.set('db', db);
//////////////in memory database zone END //////////////////////////////

app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

app.use('/api/stock', stockRoutes);
app.use('/api/product', productRoutes); 
app.use('/public', express.static(path.join(__dirname, 'public'))); // แยก static files
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
