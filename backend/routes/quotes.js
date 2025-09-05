const express = require('express');
const router = express.Router();

// Placeholder quotes routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get quotes endpoint',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create quote endpoint',
    data: null
  });
});

module.exports = router;
