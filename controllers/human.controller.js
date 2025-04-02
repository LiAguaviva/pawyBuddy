const connection = require("../config/db");
const bcrypt = require("bcrypt");

class HumanController {
  //1. HUMAN REGISTER
  showHumanRegister = (req, res) => {
    res.render("humanRegister");
  };

  // 2. POST HUMAN REGISTER
  register = (req, res) => {
    console.log(req.file);
    console.log(req.body);

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
      res.render("humanRegister", { message: "A field is missing." });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errorHash, hash) => {
        if (errorHash) {
          throw errorHash;
        } else {
          let sql = `INSERT INTO human (human_name, human_lastName, email, password, human_description, phone) VALUES (?, ?, ?, ?, ?, ?)`;
          let values = [
            human_name,
            human_lastName,
            email,
            hash,
            human_description,
            phone,
          ];
          if (req.file) {
            sql = `INSERT INTO human (human_name, human_lastName, email, password, human_description, phone, human_img) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values.push(req.file.filename);
          }

          connection.query(sql, values, (error, result) => {
            if (error) {
              if (error.errno == 1062) {
                res.render("humanRegister", {
                  message: "This email already exist",
                });
              } else {
                throw error;
              }
            } else {
              res.redirect("/");
            }
          });
        }
      });
    } else {
      res.render("humanRegister", {
        message: "Both passwords need to be the same.",
      });
    }
  };

  //5. HUMAN PROFILE
  showHumanProfile = (req, res, next) => {
    const { id } = req.params;
    let sqlHuman =
      "SELECT * FROM human WHERE human_id = ? AND human_is_deleted = 0";
    let sqlAnimal =
      "SELECT * FROM animal WHERE human_id = ? AND animal_is_deleted = 0";

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
              console.log("RESULT HUMAN PROFILE ///////////////", resultHuman[0]);

              res.render("humanProfile", {
                resultHuman: resultHuman[0],
                resultAnimal,
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
      "SELECT * FROM human WHERE human_id = ? AND human_is_deleted = 0";
    let sqlAnimal =
      "SELECT * FROM animal WHERE human_id = ? AND animal_is_deleted = 0";

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
              console.log("RESULT HUMAN YOUR PROFILE", resultHuman[0]);
              // console.log("ANIMAL RESSSSSSSSSSSSSSSSS", resultAnimal);

              res.render("humanYourProfile", {
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
    console.log(req.body);
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
              res.redirect(`/human/profile/${result[0].human_id}`)
            }
          })
          console.log(result);
        }
        console.log(result);
        
      }
    })
    
  }

  

};

 
module.exports = new HumanController();
