var express = require('express');
var router = express.Router();
const Role = require('../models/Role');

// CREATE - Tạo mới Role
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const role = new Role({
      name,
      description
    });
    
    await role.save();
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// READ - Lấy tất cả roles (không bao gồm đã xoá mềm)
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// READ - Lấy role theo ID
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE - Cập nhật role theo ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE - Xoá mềm role theo ID
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
