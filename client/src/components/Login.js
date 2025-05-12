// client/src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ลองเปลี่ยน URL เป็น full path
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("response.data.dataobj.token = " + response.data.dataobj.token);
        localStorage.setItem("token", response.data.dataobj.token); // เก็บ token ใส่ใน localStorage

        localStorage.setItem('username', username);

        // ตั้งค่า Axios default headers สำหรับคำขอต่อไป
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.dataobj.token}`;

        navigate('/home', { state: { username } }); // ไปหน้าhomeหลัง login สำเร็จ โดยส่งusername ไป Home.js โดยผ่าน location.state
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
