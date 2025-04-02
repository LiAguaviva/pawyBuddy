const connection = require('../config/db');


class IndexController {

  //1. ALL HUMAN
  allHuman = (req, res) => {
    let sql = 'SELECT * FROM human WHERE human_is_deleted = 0';

    connection.query(sql, (error, result) => {
      if (error){
        throw error;
      } else {
        console.log('RRRRRRRRRRRRRRRRRRRRRRRRR', result);
        res.render('index', {result});
        
      };
    });
  };


};



module.exports = new IndexController();