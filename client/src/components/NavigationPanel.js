// client/src/components/NavigationPanel.js
import { useNavigate } from 'react-router-dom';

function NavigationPanel({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="nav-panel">
      <h3>เมนูหลัก</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><button className="nav-button" onClick={() => navigate('/products')}>ผลิตภัณฑ์</button></li>
        <li><button className="nav-button" onClick={() => navigate('/stock')}>สต็อก</button></li>
        <li><button className="nav-button" onClick={() => navigate('/list')}>รายการ</button></li>
        <li><button className="nav-button logout-button" onClick={onLogout}>ออกจากระบบ</button></li>
      </ul>
    </div>
  );
}

export default NavigationPanel;