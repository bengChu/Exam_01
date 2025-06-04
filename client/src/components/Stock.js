import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

function Stock() {
  const navigate = useNavigate();
  const [stockData, setStockData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "asc" });
  const [loading, setLoading] = useState(true);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .post(
        "http://localhost:3001/api/stock/getstockall",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setStockData(res.data.data);
      })
      .catch((err) => console.error("Error fetching stock data:", err))
      .finally(() => setLoading(false));
  };

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

  const handleOpenConfirm = (stock) => {
    setSelectedStock(stock);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/stock/${selectedStock.Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenConfirm(false);
      setSelectedStock(null);
      fetchStock();
    } catch (err) {
      console.error("Error deleting stock:", err);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedStock(null);
  };

  return (
    <div className="product-container">
      <h1>Stock Summary</h1>

      {loading ? (
        <div>Loading...</div>
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
                <th>Id</th>
                <th onClick={() => handleSort("ProductName")}>
                  Product Name{" "}
                  {sortConfig.key === "ProductName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("Amount")}>
                  Amount{" "}
                  {sortConfig.key === "Amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
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
                      onClick={() => handleOpenConfirm(item)}
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

      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบสต็อกรายการนี้หรือไม่?
            <br />
            {selectedStock && (
              <strong>
                Id: {selectedStock.Id}, Product Name: {selectedStock.ProductName}
              </strong>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Stock;
