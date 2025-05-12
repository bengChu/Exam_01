import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import api from '../utils/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.post('http://localhost:3001/api/product/getproductall', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'ดึงข้อมูลสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts(); // โหลดข้อมูลใหม่หลังลบ
      } catch (err) {
        setError(err.response?.data?.message || 'ลบสินค้าไม่สำเร็จ');
      }
    }
  };

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
        <table className="product-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
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
                  ) : 'no image'}
                </td>
                <td>{p.Price}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/products/edit/${p.Id}`)}>
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(p.Id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;
