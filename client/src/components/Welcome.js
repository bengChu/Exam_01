// Welcome.js
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import NavigationPanel from "./NavigationPanel";
import './Welcome.css';

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "ผู้ใช้";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // เช็กว่าอยู่ที่ /welcome แบบเป๊ะ
  const isRootWelcome = location.pathname === "/welcome";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavigationPanel onLogout={handleLogout} />

      <div className="main-content">
        {/* ✅ แสดงเฉพาะเมื่ออยู่ที่ /welcome เท่านั้น */}
        {isRootWelcome && (
          <>
            <h1>สวัสดีครับ คุณ{username}</h1>
            <p>ยินดีต้อนรับสู่ระบบจัดการสินค้า</p>
          </>
        )}

        {/* แสดง component ย่อย */}
        <Outlet />
      </div>
    </div>
  );
}

export default Welcome;
