const express = require('express');
const router = express.Router();

// Placeholder notes routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get notes endpoint',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create note endpoint',
    data: null
  });
});

module.exports = router;
