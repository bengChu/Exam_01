import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../utils/api";
import "./Products.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "asc" });

  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "http://localhost:3001/api/product/getproductall",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (product) => {
    setSelectedProduct(product);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(
        `http://localhost:3001/api/product/${selectedProduct.Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenConfirm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedProduct(null);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // const getSortIndicator = (key) => {
  //   if (sortConfig.key !== key) return "";
  //   return sortConfig.direction === "asc" ? " ↑" : " ↓";
  // };

  const sortedProducts = [...products].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-container">
      <h1>Product Summary</h1>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <button
              className="add-product-btn"
              onClick={() => navigate("/home/products/add")}
            >
              Add Product
            </button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Id")}>
                  Id
                </th>
                <th onClick={() => handleSort("Name")}>
                  Product Name
                </th>
                <th>Image</th>
                <th onClick={() => handleSort("Price")}>
                  Price
                </th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => (
                <tr key={p.Id}>
                  <td>{p.Id}</td>
                  <td>{p.Name}</td>
                  <td>
                    {p.ImageUrl ? (
                      <img
                        src={`http://localhost:3001${p.ImageUrl}`}
                        alt={p.Name}
                        className="product-image"
                      />
                    ) : (
                      "no image"
                    )}
                  </td>
                  <td>{p.Price}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/home/products/edit/${p.Id}`)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleOpenConfirm(p)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?
            <br />
            {selectedProduct?.Id && (
              <strong>
                Id: {selectedProduct.Id} Name: {selectedProduct.Name}
              </strong>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Products;
