var express = require('express');
var router = express.Router();
const humanController = require('../controllers/human.controller');
const multer = require('../middlewares/multer');

//1. HUMAN REGISTER
router.get('/register', humanController.showHumanRegister);

//2. POST HUMAN REGISTER
router.post('/register', multer('human'), humanController.register);

//5. HUMAN PROFILE
router.get('/profile/:id', humanController.showHumanProfile);

//.6 YOUR PROFILE
router.get('/yourProfile/:id', humanController.showYourProfile);

//8. OPEN LOGIN FORM 
router.get('/login', humanController.showLogin);

//8. LOGIN FORM
router.post('/Login', humanController.Login);










module.exports = router;


