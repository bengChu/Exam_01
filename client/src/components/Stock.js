// client/src/components/Stock.js
import { useNavigate } from 'react-router-dom';

function Stock() {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* นำ Navigation Panel มาใช้ซ้ำ */}
      {/* ...โค้ด Navigation Panel เหมือนใน Welcome.js... */}
      
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>หน้าStock</h1>
        {/* เนื้อหาหน้าStock */}
      </div>
    </div>
  );
}

export default Stock;