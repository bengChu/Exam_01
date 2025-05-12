// client/src/components/NavigationPanel.js
import { useNavigate } from 'react-router-dom';

function NavigationPanel({ onLogout, username }) {
  const navigate = useNavigate();

  return (
    <div className="nav-panel">
      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        👤 ผู้ใช้: {username}
      </div>
      <h3>Main Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <button className="nav-button" onClick={() => navigate('products')}>
            Product
          </button>
        </li>
        <li>
          <button className="nav-button" onClick={() => navigate('stock')}>
            Stock
          </button>
        </li>
        <li>
          <button className="nav-button" onClick={() => navigate('list')}>
            List
          </button>
        </li>
        <li>
          <button className="nav-button logout-button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavigationPanel;
