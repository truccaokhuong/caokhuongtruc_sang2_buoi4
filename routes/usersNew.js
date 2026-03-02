var express = require('express');
var router = express.Router();
const User = require('../models/User');

// CREATE - Tạo mới User
router.post('/', async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;
    
    const user = new User({
      username,
      password,
      email,
      fullName,
      avatarUrl,
      role
    });
    
    await user.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// READ - Lấy tất cả users (không bao gồm đã xoá mềm)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// READ - Lấy user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE - Cập nhật user theo ID
router.put('/:id', async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role, loginCount, status } = req.body;
    
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;
    if (email !== undefined) updateData.email = email;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (role !== undefined) updateData.role = role;
    if (loginCount !== undefined) updateData.loginCount = loginCount;
    if (status !== undefined) updateData.status = status;
    
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE - Xoá mềm user theo ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /enable - Kích hoạt user (status = true)
router.post('/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required'
      });
    }
    
    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or incorrect information'
      });
    }
    
    user.status = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User enabled successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /disable - Vô hiệu hoá user (status = false)
router.post('/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required'
      });
    }
    
    const user = await User.findOne({ 
      email, 
      username, 
      isDeleted: false 
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or incorrect information'
      });
    }
    
    user.status = false;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User disabled successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
