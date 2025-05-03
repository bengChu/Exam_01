// client/src/components/Products.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import styles from './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบสินค้า
  const handleDelete = async (productId) => {
    if (window.confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts(); // ดึงข้อมูลใหม่หลังลบ
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // ดึงข้อมูลครั้งแรกเมื่อโหลด component
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      {/* Navigation Panel (นำมาจาก Welcome.js) */}
      <div className={styles.navPanel}>
        <h3>เมนูหลัก</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <button 
              className={styles.navButton}
              onClick={() => navigate('/products')}
            >
              ผลิตภัณฑ์
            </button>
          </li>
          {/* เมนูอื่นๆ */}
        </ul>
      </div>

      {/* ส่วนเนื้อหาหลัก */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>จัดการสินค้า</h1>
          <button 
            className={styles.addButton}
            onClick={() => navigate('/products/add')}
          >
            เพิ่มสินค้า
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div>กำลังโหลด...</div>
        ) : (
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>ภาพสินค้า</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className={styles.productImage}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Products;