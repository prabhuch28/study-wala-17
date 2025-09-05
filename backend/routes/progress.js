const express = require('express');
const router = express.Router();

// Placeholder progress routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get progress endpoint',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Update progress endpoint',
    data: null
  });
});

module.exports = router;
