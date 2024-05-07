const express = require('express');
const router = express.Router();
const controler = require('../middlewares/controlers');

router.get('/', controler);

module.exports = router