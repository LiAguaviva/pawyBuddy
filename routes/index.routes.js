var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index.controller');
const multer = require('../middlewares/multer');

//1. ALL HUMAN
router.get('/', multer('human'), indexController.allHuman);


module.exports = router;
