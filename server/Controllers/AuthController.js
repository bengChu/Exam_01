// server/Controllers/AuthController.js
const { v4: uuidv4 } = require('uuid');


const authUtils = require('../Utils/auth');

const { 
  hashPassword, 
  comparePassword, 
  generateToken 
} = require('../Utils/auth');

class api_Response {
  constructor() {
    this.message = "";
    this.success = true;
    this.request_id = uuidv4();
    this.dataobj = null;
  }
}

exports.login = async (req, res) => {
  try {

    console.log("req.body = ", req.body);
    const { username, password } = req.body; //ชื่อตัวแปรตามreqที่ส่งมา

    const pwd = await authUtils.hashPassword(password);
    //console.log("pwd = ", pwd);
    

    const db = req.app.get('db');
    
    if (!username || !password) {
      const response = new api_Response();
      response.success = false;
      response.message = "Username and password are required";
      return res.status(400).json(response);
    }

    const user = db.User.find(u => u.Id === username);
    
    if (!user) {
      const response = new api_Response();
      response.success = false;
      response.message = "Invalid username or password";
      return res.status(401).json(response);
    }
    //console.log("user.Password in db = ", user.Password);

    // ตรวจสอบ Password
    const isMatch = await comparePassword(password, user.Password);
    console.log("isMatch = ", isMatch);
    if (!isMatch) {
      const response = new api_Response();
      response.success = false;
      response.message = "Invalid username or password";
      return res.status(401).json(response);
    }

    // สร้าง Token
    const token = generateToken(user.Id);

    const response = new api_Response();
    response.message = "Login successful";
    response.dataobj = { 
      userId: user.Id,
      token 
    };
    
    console.log("Login successful สร้าง token ได้ = ", token);
    return res.status(200).json(response);

  } catch (error) {
    console.error("Login error:", error);
    const response = new api_Response();
    response.success = false;
    response.message = "Internal server error";
    return res.status(500).json(response);
  }
};