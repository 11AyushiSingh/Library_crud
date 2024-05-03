const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required!",
      });
    }
    
    const lowercaseUsername = username.toLowerCase();
    
    const existingUser = await User.findOne({ username: lowercaseUsername });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_KEY));
    const newUser = new User({ username: lowercaseUsername, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id: newUser._id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: `Error: ${error.message}`,
    });
  }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: "Username and password both are required.",
        });
      }
      const lowercaseUsername = username.toLowerCase();

      const existingUser = await User.findOne({ username: lowercaseUsername });
  
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "Username does not exist.",
        });
      }
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
      }

      const token = generateToken(existingUser); 
      const userData = {
        id: existingUser._id,
        username: existingUser.username,
      };
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: `Error: ${error.message}`,
      });
    }
  };
  
function generateToken(user) {
    const payload = {
      userId: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
  
    return token;
  }