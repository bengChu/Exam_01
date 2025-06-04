import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function StockForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ถ้ามี id แสดงว่าเป็นหน้า edit
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    ProductId: "",
    Amount: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // โหลดสินค้าทั้งหมด
    axios
      .post("http://localhost:3001/api/product/getproductall", {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch(() => setError("โหลดรายการสินค้าล้มเหลว"));

    // ถ้าเป็น edit ให้โหลด stock
    if (isEdit) {
      axios
        .get(`http://localhost:3001/api/stock/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData({
            ProductId: res.data.ProductId,
            Amount: res.data.Amount,
          });
        })
        .catch(() => setError("โหลดข้อมูลสต็อกล้มเหลว"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3001/api/stock/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3001/api/stock/add",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/home/stock");
    } catch (err) {
      setError("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <div className="stock-form-container" style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>{isEdit ? "Edit Stock" : "Add Stock"}</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Product</label>
            <select
              name="ProductId"
              value={formData.ProductId}
              onChange={handleChange}
              required
              disabled={isEdit}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            >
              <option value="">-- เลือกสินค้า --</option>
              {products.map((p) => (
                <option key={p.Id} value={p.Id}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Amount (+ เพิ่ม / - ลด)</label>
            <input
              type="number"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "#28a745",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {isEdit ? "Save" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/home/stock")}
              style={{
                flex: 1,
                backgroundColor: "#6c757d",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StockForm;
