import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Products from "./components/Products";
import Stock from "./components/Stock";
import List from "./components/List";
import ProtectedRoute from "./components/ProtectedRoute";
// import ProductForm from "./components/ProductForm";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import StockForm from "./components/StockForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Protected Home Layout */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            {/* ✅ Nested Routes ที่แสดงใน <Outlet /> ของ Home */}
            <Route path="products" element={<Products />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="stock" element={<Stock />} />
            <Route path="stock/add" element={<StockForm />} />
            <Route path="stock/edit/:id" element={<StockForm />} />

            <Route path="list" element={<List />} />
          </Route>

          {/* ProductForm ยังเป็น route หลักได้ ถ้าไม่ต้องแสดงใน Home */}
          {/* <Route path="/products/add" element={<ProductForm />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
