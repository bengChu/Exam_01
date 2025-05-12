import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './EditProduct.css';

function EditProduct() {
  const { id } = useParams(); // ดึง product id จาก URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Price: '',
    ImageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ดึงข้อมูลสินค้าปัจจุบัน
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'ดึงข้อมูลสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('แก้ไขข้อมูลเรียบร้อย');
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถบันทึกการแก้ไขได้');
    }
  };

  return (
    <div className="edit-product-container">
      <h1>แก้ไขสินค้า</h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>กำลังโหลดข้อมูล...</div>
      ) : (
        <form className="edit-form" onSubmit={handleSubmit}>
          <label>
            ชื่อสินค้า:
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            ราคา:
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            ลิงก์รูปภาพ (ImageUrl):
            <input
              type="text"
              name="ImageUrl"
              value={formData.ImageUrl}
              onChange={handleChange}
            />
          </label>

          {formData.ImageUrl && (
            <img
              src={`http://localhost:3001${formData.ImageUrl}`}
              alt="preview"
              className="image-preview"
            />
          )}

          <div className="form-buttons">
            <button type="submit">บันทึก</button>
            <button type="button" onClick={() => navigate('/products')}>
              ยกเลิก
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditProduct;
