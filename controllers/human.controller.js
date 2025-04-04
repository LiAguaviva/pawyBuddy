const connection = require('../config/db');
const bcrypt = require('bcrypt');

class HumanController {
  //1. HUMAN REGISTER
  showHumanRegister = (req, res) => {
    res.render('humanRegister');
  };

  // 2. POST HUMAN REGISTER
  register = (req, res) => {
    const {
      human_name,
      human_lastName,
      email,
      password,
      repPassword,
      human_description,
      phone,
    } = req.body;

    if (
      !human_name ||
      !human_lastName ||
      !email ||
      !password ||
      !repPassword ||
      !human_description ||
      !phone
    ) {
      res.render('humanRegister', { message: 'A field is missing.' });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errorHash, hash) => {
        if (errorHash) {
          throw errorHash;
        } else {
          let sql = 'INSERT INTO human (human_name, human_lastName, email, password, human_description, phone) VALUES (?, ?, ?, ?, ?, ?)';
          let values = [
            human_name,
            human_lastName,
            email,
            hash,
            human_description,
            phone,
          ];
          if (req.file) {
            sql = 'INSERT INTO human (human_name, human_lastName, email, password, human_description, phone, human_img) VALUES (?, ?, ?, ?, ?, ?, ?)';
            values.push(req.file.filename);
          }

          connection.query(sql, values, (error, result) => {
            if (error) {
              if (error.errno == 1062) {
                res.render('humanRegister', {
                  message: 'This email already exist',
                });
              } else {
                throw error;
              }
            } else {
              res.redirect('/');
            }
          });
        }
      });
    } else {
      res.render('humanRegister', {
        message: 'Both passwords need to be the same.',
      });
    }
  };

  //5. HUMAN PROFILE
  showHumanProfile = (req, res, next) => {
    const { id } = req.params;
    let sqlHuman = `SELECT * FROM human WHERE human_id = ? AND human_is_deleted = 0`;
    let sqlAnimal = `SELECT * FROM animal WHERE human_id = ? AND animal_is_deleted = 0`;

    connection.query(sqlHuman, [id], (errorHuman, resultHuman) => {
        if (errorHuman) {
            throw errorHuman;
        } else {
            if (resultHuman.length == 0) {
                next();
            } else {
                connection.query(sqlAnimal, [id], (errorAnimal, resultAnimal) => {
                    if (errorAnimal) {
                        throw errorAnimal;
                    } else {
                        // PREVIOUS AND NEXT PROFILES IDs
                        this.getPreviousId(id, (err, prevId) => {
                            if (err) {
                                return res.status(500).send('Server error');
                            }

                            this.getNextId(id, (err, nextId) => {
                                if (err) {
                                    return res.status(500).send('Server error');
                                }

                                res.render('humanProfile', {
                                    resultHuman: resultHuman[0],
                                    resultAnimal,
                                    prevId,
                                    nextId
                                });
                            });
                        });
                    }
                });
            }
        }
    });
};


 

  //5. YOUR PROFILE
  showYourProfile = (req, res, next) => {
    const { id } = req.params;
    let sqlHuman =
      'SELECT * FROM human WHERE human_id = ? AND human_is_deleted = 0';
    let sqlAnimal =
      'SELECT * FROM animal WHERE human_id = ? AND animal_is_deleted = 0';

    connection.query(sqlHuman, [id], (errorHuman, resultHuman) => {
      if (errorHuman) {
        throw errorHuman;
      } else {
        if (resultHuman.length == 0) {
          next();
        } else {
          connection.query(sqlAnimal, [id], (errorAnimal, resultAnimal) => {
            if (errorAnimal) {
              throw errorAnimal;
            } else {
              res.render('humanYourProfile', {
                resultHuman: resultHuman[0],
                resultAnimal,
              });
            }
          });
        }
      }
    });
  };

   
  //8. OPEN LOGIN FORM 
  showLogin = (req, res) => {
    res.render('HumanLogin');
  };

  //9. LOGIN FORM 
  Login = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM human WHERE email = ? AND human_is_deleted = 0';

    connection.query(sql, [email], (error, result) => {
      if (error) {
        throw error;
      } else {
        if (!result.length) {
          res.render('humanLogin', {message: 'incorrect email or password'})
        } else {
          let hash = result[0].password
          bcrypt.compare(password, hash, (error, resultCompare) => {
            if (!resultCompare) {
              res.render('humanLogin', {message: 'incorrect email or password'})
            } else {
              req.session.userId = result[0].human_id;
              req.session.userName = result[0].human_name;
              res.redirect(`/human/profile/${result[0].human_id}`)
            }
          })
        }
      }
    })
    
  }

  // 9. OPEN EDIT FORM
  showEditProfile = (req, res, next) => {
    const {id} = req.params;
    let sql = 'SELECT * FROM human WHERE human_id = ? AND human_is_deleted = 0';
    connection.query(sql, [id], (error, result) => {
      if (error) {
        throw error;
      } else {
        if (!result.length) {
          next();
        } else {
          res.render('humanEdit', {result: result[0]});
        };
      };
    });
  };

  // 10. EDIT HUMAN POST 
  editHumanProfile = (req, res) => {
    const {id} = req.params;
    const {
      human_name,
      human_lastName,
      password,
      repPassword,
      human_description,
      phone,
    } = req.body;

    let result = {
      human_id: id,
      human_name: human_name,
      human_lastName: human_lastName,
      human_description: human_description,
      phone: phone,
    };

    if (
      !human_name ||
      !human_lastName ||
      !password ||
      !repPassword ||
      !human_description ||
      !phone
    ) {
      
      res.render('humanEdit', {result, message: 'A field is missing.' });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errorHash, hash) => {
        if (errorHash) {
          throw errorHash;
        } else {
          let sql = 'UPDATE human SET human_name = ?, human_lastName = ?, password = ?, human_description = ?, phone = ? WHERE human_id = ?';
          let values = [
            human_name,
            human_lastName,
            hash,
            human_description,
            phone,
            id
          ];
          if (req.file) {
            sql = 'UPDATE human SET human_name = ?, human_lastName = ?, password = ?, human_description = ?, phone = ?, human_img = ? WHERE human_id = ?';
            values.push(req.file.filename);
          }

          connection.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            } else {
              res.redirect(`/human/profile/${id}`);
            }
          });
        }
      });
    } else {
      res.render('humanEdit', {
        result,
        message: 'Both passwords need to be the same.',
      });
    }
  }

  //11. DELETE ACCOUNT
  deleteAccount = (req, res) => {
    const {human_id} = req.params;
    let sql = 'UPDATE human SET human_is_deleted = 1 WHERE human_id = ?';
    connection.query(sql, [human_id], (error, result) => {
      if (error) {
        throw error;
      } else {
        res.redirect('/')
      }
    })
  }

  //PREVIOUS ID (TO SEE PREVIOUS PROFILE) 
    getPreviousId = (currentId, callback) => {
      let sql = 'SELECT human_id FROM human WHERE human_is_deleted = 0 ORDER BY human_id DESC';
  
      connection.query(sql, (error, result) => {
        if (error) {
          return callback(error, null);
        }
  
        const ids = result.map(row => row.human_id);
        const index = ids.indexOf(currentId);
  
        let prevId;
        if (index === -1 || index === ids.length - 1) {
          prevId = ids[0];
        } else {
          prevId = ids[index + 1]; 
        }
  
        callback(null, prevId);
      });
    };

    //NEXT ID (TO SEE NEXT PROFILE)
    getNextId = (currentId, callback) => {
      let sql = `
          SELECT human_id FROM human 
          WHERE human_id > ? AND human_is_deleted = 0 
          ORDER BY human_id ASC 
          LIMIT 1`;
  
      connection.query(sql, [currentId], (error, result) => {
          if (error) {
              return callback(error, null);
          }
          if (result.length > 0) {
              callback(null, result[0].human_id);
          } else {
              let minSql = `SELECT MIN(human_id) AS min_id FROM human WHERE human_is_deleted = 0`;
              connection.query(minSql, (error, minResult) => {
                  if (error) {
                      return callback(error, null);
                  }
                  callback(null, minResult[0].min_id);
              });
          }
      });
  };

};

 
module.exports = new HumanController();
