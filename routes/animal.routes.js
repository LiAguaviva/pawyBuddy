var express = require('express');
var router = express.Router();
const animalController = require('../controllers/animal.controller');
const multer = require('../middlewares/multer');

//1. CREATE ANIMAL FROM HUMAN PROFILE
router.get('/createAnimal', animalController.createAnimal)

// 2. ADD ANIMAL FORM - FROM NAVBAR- SELECTING HUMAN OF ANIMAL 
router.get('/addSelect', animalController.showAddAnimalSelect);

// 2.5 ADD ANIMAL FORM - FROM PROFILE 
router.get('/add/:human_id', animalController.showAddAnimal);

//3. ADD ANIMAL  - FROM NAVBAR- POST
router.post('/addSelect', multer('animal'), animalController.addAnimalPostSelect);

//3.5 ADD ANIMAL  - FROM PROFILE
router.post('/add/:human_id', multer('animal'), animalController.addAnimalPost);

//4. EDIT ANIMAL FORM
router.get('/edit/:id', animalController.showEditAnimal);

//5. EDIT ANIMAL POST
router.post('/edit/:id/:human_id', multer('animal'), animalController.editAnimal);

//6. LOGIC DELETE
router.get('/delLogicAnimal/:animal_id/:human_id', animalController.logiclDel);

//7. TOTAL DELETE
router.get('/delTotalAnimal/:animal_id/:human_id', animalController.delTotal);

module.exports = router;

