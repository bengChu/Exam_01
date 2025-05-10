import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Products from "./components/Products";
import Stock from "./components/Stock";
import List from "./components/List";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Protected Welcome Layout */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          >
            {/* ✅ Nested Routes ที่แสดงใน <Outlet /> ของ Welcome */}
            <Route path="products" element={<Products />} />
            <Route path="stock" element={<Stock />} />
            <Route path="list" element={<List />} />
          </Route>

          {/* ProductForm ยังเป็น route หลักได้ ถ้าไม่ต้องแสดงใน Welcome */}
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
