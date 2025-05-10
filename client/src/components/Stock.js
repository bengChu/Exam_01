// client/src/components/Stock.js
import { useNavigate } from 'react-router-dom';

function Stock() {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2>หน้าจัดการสต็อก</h2>
      <p>แสดงรายการสินค้าคงคลัง...</p>
    </div>
  );
}

export default Stock;