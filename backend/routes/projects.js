const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');

// Get all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await Project.create({ name, description, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch(error) {
    res.status(500).json({ message: 'Server error' });
  }
})

module.exports = router;
