// client/src/components/List.js
import { useNavigate } from 'react-router-dom';

function List() {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* นำ Navigation Panel มาใช้ซ้ำ */}
      {/* ...โค้ด Navigation Panel เหมือนใน Welcome.js... */}
      
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>หน้าList</h1>
        {/* เนื้อหาหน้าList */}
      </div>
    </div>
  );
}

export default List;