import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ Name: "", Price: "", ImageUrl: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `http://localhost:3001/api/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("productImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "http://localhost:3001/api/product/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProduct((prev) => ({
        ...prev,
        ImageUrl: response.data.imageUrl,
      }));
    } catch (err) {
      setError("อัปโหลดรูปภาพไม่สำเร็จ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`http://localhost:3001/api/product/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/home/products");
    } catch (err) {
      setError(err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>
          <b>Id:</b>
          <input type="text" value={product.Id} readOnly />
        </label>
        <label>
          <b>Name:</b>
          <input
            type="text"
            name="Name"
            value={product.Name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <b>Image:</b>
          {product.ImageUrl && (
            <img
              src={`http://localhost:3001${product.ImageUrl}`}
              alt="product"
              className="edit-product-image-preview"
            />
          )}
          <label className="custom-file-upload">
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </label>
        <label>
          <b>Price:</b>
          <input
            type="number"
            name="Price"
            value={product.Price}
            onChange={handleChange}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/home/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
