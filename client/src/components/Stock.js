import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Products.css"; // ใช้ style เดียวกับหน้า Products

function Stock() {
  const navigate = useNavigate();
  const [stockData, setStockData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:3001/api/stock/getstockall",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStockData(response.data.data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError(err.response?.data?.message || "ดึงข้อมูลสต็อกไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const sortedData = [...stockData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="product-container">
      <h1>Stock Summary</h1>

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
              onClick={() => navigate("/home/stock/add")}
            >
              Add Stock
            </button>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Id")}>Id</th>
                <th onClick={() => handleSort("ProductName")}>Product Name</th>
                <th onClick={() => handleSort("Amount")}>Amount</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.Id}>
                  <td>{item.Id}</td>
                  <td>{item.ProductName}</td>
                  <td>{item.Amount}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/home/stock/edit/${item.Id}`)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => console.log("Delete", item.Id)}
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
    </div>
  );
}

export default Stock;
