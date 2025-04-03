const connection = require('../config/db');
const deleteFile = require('../utils/deleteFile');


class AnimalController {

  //1. CREATE ANIMAL FROM HUMAN PROFILE
  createAnimal = (req, res) => {
    console.log(req.file);
    const {human_id} = req.params;
    const {animal_name, description, adopt_year, species} = req.body;

    let sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id) VALUES (?, ?, ?, ?, ?)';
    let values = [animal_name, description, adopt_year, species, human_id];

    if (req.file) {
        sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id, animal_img) VALUES (?, ?, ?, ?, ?, ?)';
        values.push(req.file.filename);
    };
    connection.query(sql, values, (error, result) => {
        if (error) {
            throw error
        } else{
            res.redirect(`/human/profile/${human_id}`)
        };
    });
};

  
 //2. ADD ANIMAL FORM - FROM NAVBAR- SELECTING HUMAN OF ANIMAL 
 showAddAnimalSelect = (req, res) => {
  let sql = 'SELECT human_id, human_name FROM human WHERE human_is_deleted = 0';
  connection.query(sql, (error, result) => {
    if (error) {
      throw error;
    } else {
      console.log(result);
      res.render('animalAdd', {result});
    }
  })
 }

  //2.5 ADD ANIMAL FORM - FROM PROFILE 
  showAddAnimal = (req, res) => {
    let {human_id} = req.params;
    
    res.render('animalAddProfile', {resultHuman: human_id}); 
   }

 //3. ADD ANIMAL - FROM NAVBAR- POST
 addAnimalPostSelect = (req, res) => {
  console.log(req.body, 'BODYYYYYYYYYYYYYYYYYYY');

  const {animal_name, description, adopt_year, species, human_id} = req.body;

  if ( !animal_name || !description || !adopt_year || !species || !human_id) {
    let sql = 'SELECT human_id, human_name FROM human WHERE human_is_deleted = 0';
    connection.query(sql, (error, result) => {
      if (error) {
        throw error;
      } else {
        res.render('animalAdd', {result, message:'A field is missing.'})
      }
    })
  } else {
    let sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id) VALUES (?, ?, ?, ?, ?)'
    let values = [animal_name, description, adopt_year, species, human_id];
    if (req.file) {
     sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id, animal_img) VALUES (?, ?, ?, ?, ?, ?)'
      values.push(req.file.filename);
    }
    connection.query(sql, values, (error, result) => {
      if (error) {
        throw error
      } else {
        res.redirect(`/human/profile/${human_id}`);
      };
    });
  };
 };

//3.5 ADD ANIMAL  - FROM PROFILE
 addAnimalPost = (req, res) => {
  console.log(req.body, 'BODYYYYYYYYYYYYYYYYYYY');
  
  const {human_id} = req.params;
  const {animal_name, description, adopt_year, species} = req.body;

  if ( !animal_name || !description || !adopt_year || !species || !human_id) {
    let sql = 'SELECT human_id, human_name FROM human WHERE human_is_deleted = 0';
    connection.query(sql, (error, result) => {
      if (error) {
        throw error;
      } else {
        res.render('animalAddProfile', {resultHuman: human_id, message:'A field is missing.'});
      }
    })
  } else {
    let sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id) VALUES (?, ?, ?, ?, ?)'
    let values = [animal_name, description, adopt_year, species, human_id];
    if (req.file) {
     sql = 'INSERT INTO animal (animal_name, description, adopt_year, species, human_id, animal_img) VALUES (?, ?, ?, ?, ?, ?)'
      values.push(req.file.filename);
    }
    connection.query(sql, values, (error, result) => {
      if (error) {
        throw error
      } else {
        res.redirect(`/human/yourProfile/${human_id}`);
      };
    });
  };
 };

 //4. EDIT ANIMAL FORM VIEW
 showEditAnimal = (req, res, next) => {
  const {id} = req.params;
  let sql = 'SELECT * FROM animal WHERE animal_id = ? AND animal_is_deleted = 0';
  connection.query(sql, [id], (error, result) => {
    if (error) {
      throw error;
    } else {
      if (!result.length) {
        next ();
      } else {
        res.render('animalEdit', {result: result[0]});
      };
    };
  });
 };

 //5. EDIT ANIMAL POST
 editAnimal = (req, res) => {
  const {id, human_id} = req.params;
  const {animal_name, description, adopt_year, species} = req.body;

  if (!animal_name || !description || !adopt_year || !species) {
    let result = {
      animal_id: id,
      human_id: human_id,
      animal_name: animal_name,
      description: description,
      adopt_year: adopt_year,
      species: species,
    };
    res.render('animalEdit', {result, message: 'A field is missing.'});
  } else {
    let sql = 'UPDATE animal SET animal_name = ?, description = ?, adopt_year = ?, species = ? WHERE animal_id = ?';
    let values = [animal_name, description, adopt_year, species, id];

    if (req.file) {
      sql = 'UPDATE animal SET animal_name = ?, description = ?, adopt_year = ?, species = ?, animal_img = ? WHERE animal_id = ?';
      values = [animal_name, description, adopt_year, species, req.file.filename, id];
    }

    connection.query(sql, values, (error, result) => {
      if (error) {
        throw error;
      } else {
       
        res.redirect(`/human/yourProfile/${human_id}`);
      };
    });
  };
 };

 //6. DELETE LOGIC
 logiclDel = (req, res) => {
  const {animal_id, human_id} = req.params;
  let sql = 'UPDATE animal SET animal_is_deleted = 1 WHERE animal_id = ?';
  connection.query(sql, [animal_id], (error, result) => {
    if (error) {
      throw error;
    } else {
      res.redirect(`/human/profile/${human_id}`)
    }
  })
 }

 //7. TOTAL DELETE
 delTotal = (req, res) => {
  const {animal_id, human_id} = req.params;

  let sql = 'DELETE FROM animal WHERE animal_id = ?'
  connection.query(sql, [animal_id], (error, result) => {
    if (error) {
      throw error;
    } else {
      res.redirect(`/human/profile/${human_id}`);
    }
  })
 }
  

};

module.exports = new AnimalController();