// Home.js
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import NavigationPanel from "./NavigationPanel";
import './Home.css';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "ผู้ใช้";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // เช็กว่าอยู่ที่ /home แบบเป๊ะ
  const isRootHome = location.pathname === "/home";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavigationPanel onLogout={handleLogout} username={username} />

      <div className="main-content">
        {/* ✅ แสดงเฉพาะเมื่ออยู่ที่ /home เท่านั้น */}
        {isRootHome && (
          <>
            <h1>Welcome... {username}</h1>
            {/* <p>ยินดีต้อนรับสู่ระบบจัดการสินค้า</p> */}
          </>
        )}

        {/* แสดง component ย่อย */}
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
