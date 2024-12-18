const mysql = require('mysql');
const moment = require('moment');
const {  DATABASE_URL, DATABASE_USER,  DATABASE_PASSWORD, DATABASE_NAME } = process.env;

  //Live Database sql server
  //Server
   const con = mysql.createConnection({
     host: DATABASE_URL,
     user: DATABASE_USER,
     password: DATABASE_PASSWORD,
     database: DATABASE_NAME,
   });

  con.connect(function(err) {
    if (err)
      throw err;
    console.log("Database Connected!");
  });
  setInterval(()=>{


    con.query('SELECT * from devicetable', function (error, results) {
      if (error) {
          throw error;;
      }
      else {
          if (results.length>0) {
                (async () => {   
                  
                  results.map((item)=>{

                    let db_date = new Date(item.updt_time)
                    let update =  new Date(db_date.setMinutes(db_date.getMinutes() + 330))
                    let current_date = new Date()
                    let diff_date = (current_date.getTime()-update.getTime())/60000
                 
                   if(Math.round(diff_date) <=239){
                 
                      var sqlquery = `UPDATE devicetable SET devicestatus=0 WHERE id=${item.id}`;
                      con.query(sqlquery, function (error, results) {
                        if (error) {
                            throw error;;
                        }
                      })


                   }else{
                    
                      var sqlquery = `UPDATE devicetable SET devicestatus=1 WHERE id=${item.id}`;
                      con.query(sqlquery, function (error, results) {
                        if (error) {
                            throw error;;
                        }
                      })
                   }
                
                 })
            
              })();
          }
          
      }
  });

   
  },1000)
 

  module.exports = con;
  