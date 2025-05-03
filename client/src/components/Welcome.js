import { useLocation, useNavigate } from "react-router-dom";

import NavigationPanel from "./NavigationPanel";
import './Welcome.css';

function Welcome() {
  const location = useLocation();
  const username = location.state?.username || "ผู้ใช้";

  const navigate = useNavigate();

  const handleLogout = () => {
    // ลบข้อมูลการล็อกอิน
    localStorage.removeItem("token");

    // ไปหน้า Login
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavigationPanel onLogout={handleLogout} />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>สวัสดีครับ คุณ{username}</h1>
        <p>ยินดีต้อนรับสู่ระบบจัดการสินค้า</p>
        {/* เนื้อหาหลักของหน้า */}
      </div>
    </div>
  );

  // สไตล์สำหรับปุ่มนำทาง
  const navButtonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "left",
  };
}
export default Welcome;
