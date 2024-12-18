const db = require('../DBConnection');
var _ = require('underscore');
const moment = require('moment');
const bcrypt = require("bcryptjs");
const e = require('express');

var UserInfo = {


    AddNewUser: function (obj, callback) {

        db.query('SELECT * from Users where email=' + db.escape(obj.email), function (error, results) {
            if (error) {
                throw error;;
            }
            else {
                if (results.length == 0) {
                    (async () => {
                        const salt = await bcrypt.genSalt(10);
                        obj.userpassword = await bcrypt.hash(obj.userpassword, salt);
                        var sqlquery = "INSERT INTO Users(`name`,`email`,`mobileno`,`userpassword`) VALUES ('" + obj.name + "','" + obj.email + "','" + obj.mobileno + "','" + obj.userpassword + "')";
                        db.query(sqlquery, function (error, result) {
                            if (error) {
                                throw error
                            }
                            else {
                                callback(1, null);
                            }
                        });
                    })();
                }
                else {
                    callback(0, null);
                }
            }
        });

    },
    Login: function (obj, callback) {
        db.query('SELECT * from Users where email=' + db.escape(obj.email), function (error, results) {
            if (error) {
                callback(error, null);
            }
            else {
                if (results.length == 1) {

                    callback(results[0], null);
                }
                else {
                    callback(0, null);
                }
            }
        });

    },
    AddNewDevice: function (obj, callback) {

        db.query('SELECT * from devicetable where deviceid=' + db.escape(obj.deviceid), function (error, results) {
            if (error) {
                throw error;;
            }
            else {
                if (results.length == 0) {
                    //  (async () => {   
                    var sqlquery = "INSERT INTO devicetable(`devicename`,`deviceid`,`userid`,`latitude`,`longitude`,`areaid`) VALUES ('" + obj.devicename + "','" + obj.deviceid + "','" + obj.userid + "','" + obj.latitude + "','" + obj.longitude + "','" + obj.areaid + "')";
                    db.query(sqlquery, function (error, result) {
                        if (error) {
                            throw error
                        }
                        else {
                            callback(1, null);
                        }
                    });
                    //})();
                }
                else {
                    callback(0, null);
                }
            }
        });

    },
    DeviceList: function (obj, callback) {

        var limit  = obj.body.limit || 10;
        var page   = obj.body.page;
        var offset = (page * limit) - limit;
        if (obj.body.areanumber && obj.body.areanumber !== '0') {
            
            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber  where userid=' + db.escape(obj.body.userid) + " and devicetable.areaid=" + db.escape(obj.body.areanumber), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable inner join area ON devicetable.areaid = area.areanumber  where userid =' + db.escape(obj.body.userid) + ' and devicetable.areaid=' + db.escape(obj.body.areanumber) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        } else {
            db.query('SELECT id as total FROM devicetable where userid=' + db.escape(obj.body.userid), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select areaid, deviceid, devicename, alerttemp, alerthumi, alertmoisture, createdat, alerttypetemp, alerttypehumi, alerttypemoisture, mintemprange, maxtemprange, minmoistrange, maxmoistrange, minhumirange, maxhumirange from devicetable where userid =' + db.escape(obj.body.userid) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {  

                        var objdata = {
                            data         : result,
                            totalpage    : parseInt(total_pages),
                            totalrecoard : parseInt(data.length)
                        }
                        callback(objdata, null);
                    }
                });
            });
        }
    },
    DeviceListSocket: function (obj, callback) {

        var limit = obj.limit || 10;
        var page = obj.page;
        var offset = (page * limit) - limit;
        if (parseInt(obj.areanumber) != 0 && parseInt(obj.devicestatus) == 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.areaid=" + db.escape(obj.areanumber), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.areaid=' + db.escape(obj.areanumber) + 'order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }
        else if (parseInt(obj.areanumber) == 0 && parseInt(obj.devicestatus) != 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.devicestatus=" + db.escape(obj.devicestatus), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.devicestatus=' + db.escape(obj.devicestatus) + 'order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });


        }
        else if (parseInt(obj.areanumber) != 0 && parseInt(obj.devicestatus) != 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.areaid=" + db.escape(obj.areanumber) + " and devicetable.devicestatus=" + db.escape(obj.devicestatus), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.areaid=' + db.escape(obj.areanumber) + ' and devicetable.devicestatus=' + db.escape(obj.devicestatus) + 'order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });


        }
        else {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }


    },
    DeviceListSocketNotification: function (obj, callback) {

                var sqlquery = 'select id, deviceid,  devicename, notify_temp, notify_humi, notify_moist, notify_fire from devicetable where userid =' + db.escape(obj.userid);
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(result, null);
                    }
                });
          
       

    },
    DeviceListActiveSocket: function (obj, callback) {

        var limit = obj.limit || 10;
        var page = obj.page;
        var offset = (page * limit) - limit;
        if (parseInt(obj.areanumber) != 0 && parseInt(obj.devicestatus) == 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.areaid=" + db.escape(obj.areanumber)+" and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1)", function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.areaid=' + db.escape(obj.areanumber) +' and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1) order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }
        else if (parseInt(obj.areanumber) == 0 && parseInt(obj.devicestatus) != 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.devicestatus=" + db.escape(obj.devicestatus)+" and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1)", function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.devicestatus=' + db.escape(obj.devicestatus) + ' and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1) order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });


        }
        else if (parseInt(obj.areanumber) != 0 && parseInt(obj.devicestatus) != 2) {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid) + " and devicetable.areaid=" + db.escape(obj.areanumber) + " and devicetable.devicestatus=" + db.escape(obj.devicestatus)+" and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1)", function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and devicetable.areaid=' + db.escape(obj.areanumber) + ' and devicetable.devicestatus=' + db.escape(obj.devicestatus) + ' and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1) order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });


        }
        else {

            db.query('SELECT devicetable.id as total FROM devicetable inner join area ON devicetable.areaid = area.areanumber where userid=' + db.escape(obj.userid)+" and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1)", function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select devicetable.*,area.AreaName from devicetable  inner join area ON devicetable.areaid = area.areanumber where userid =' + db.escape(obj.userid) + ' and (count_temp=1 or count_humi=1 or count_moist=1 or fire=1) order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }


    },
    updateNewDevice: function (obj, callback) {

        if (obj.status) {
            var sqlquery = `UPDATE devicetable SET devicestatus=${obj.status} WHERE deviceid="${obj.deviceid}" AND userid=${obj.userid}`;
            db.query(sqlquery, function (error, result) {
                if (error) {
                    throw error
                }
                else {
                    callback(1, null);
                }
            });
        } else {
            db.query(`SELECT * FROM devicetable WHERE deviceid="${obj.deviceid}"`, function (error, results) {
                if (error) {
                    throw error;;
                }
                else {
                    if (results.length != 0) {
                        var sqlquery = `UPDATE Env.devicetable SET devicename='${obj.devicename}',latitude = '${obj.latitude}', longitude = '${obj.longitude}',areaid ='${obj.areaid}'  WHERE deviceid ='${obj.deviceid}' AND userid='${obj.userid}'`;
                        
                        db.query(sqlquery, function (error, result) {
                            if (error) {
                                throw error
                            }
                            else {
                                callback(1, null);
                            }
                        });

                    }
                    else {
                        callback(0, null);
                    }
                }
            });
        }

    },
    deviceAreaBase: function (obj, callback) {
        db.query(`select count(deviceid) as 'totalDevice',
                count(case when devicestatus=1 then 1 else null end) as 'totalDeactive',
                count(case when devicestatus=0 then 1 else null end) as 'totalActive'
                from devicetable where areaid=${obj.areaid}`, function (error, deviceCount) {
            if (error) {
                callback(error, null);
            }
            else {
                if (obj.devicestatus == "all") {
                    var sqlquery = "select * from devicetable where areaid=" + db.escape(obj.areaid);
                } else {
                    var sqlquery = "select * from devicetable where areaid=" + db.escape(obj.areaid) + "and devicestatus=" + db.escape(parseInt(obj.devicestatus));
                }
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        let results = {
                            data: result, deviceCount
                        }
                        callback(results, null);
                    }
                });
            }
        })
    },
    deletedevice: function (obj, callback) {
        db.query("DELETE FROM devicetable WHERE deviceid=" + db.escape(obj.id), function (error, result) {
            if (error) {
                throw error
            }
            else {
                callback(1, 1);
            }
        });
    },
    deviceAreaUpdate: function (obj, callback) {
        var sqlquery = "UPDATE devicetable set areaid =" + db.escape(obj.areaid) + ", latitude = " + db.escape(obj.lat) + ", longitude = " + db.escape(obj.lng) + "  WHERE id =" + db.escape(obj.id);
        db.query(sqlquery, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(1, null);
            }
        });
    },
    deviceAreaInfoDetails: function (obj, callback) {

        var sqlquery = "SELECT devicetable.*, area.AreaName FROM devicetable inner join area ON devicetable.areaid = area.areanumber where devicetable.deviceid=" + db.escape(obj.deviceid) + " and devicetable.userid=" + db.escape(obj.userid);
        db.query(sqlquery, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                
                var sqlQuery1 = "SELECT * FROM(SELECT * FROM Env.history_table  where deviceid=" + db.escape(obj.deviceid) + " and userid=" + db.escape(obj.userid) + " ORDER BY id DESC LIMIT 5) AS sub  ORDER BY id DESC;"
                db.query(sqlQuery1, function (error, results) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        let newdata = {
                            ...result[0],
                            historyList : results
                        }
                        callback(newdata, null);
                    }
                })

            }
        });
    },
    deviceAlertHistory: function (obj, callback) {
        var limit = obj.body.limit || 10;
        var page = obj.body.page;
        var offset = (page * limit) - limit;
        if (obj.body.deviceid) {
            db.query(`SELECT * FROM history_table WHERE deviceid=${obj.body.deviceid} and userid=${obj.body.userid}`, function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = `SELECT * FROM history_table WHERE deviceid=${obj.body.deviceid} and userid=${obj.body.userid} LIMIT ${limit} OFFSET ${offset}`;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        } else {
            db.query(`SELECT * FROM history_table WHERE userid=${obj.body.userid}`, function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = `SELECT * FROM history_table WHERE userid=${obj.body.userid} LIMIT ${limit} OFFSET ${offset}`;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }
    },
    singleDevice: function (obj, callback) {
        db.query(`SELECT bt.deviceid, bt.devicename, bt.latitude, bt.longitude, bt.createdat, bt.areaid, ar.AreaName FROM devicetable As bt INNER JOIN area As ar ON ar.AreaNumber = bt.areaid WHERE userid=${obj.userid} AND deviceid="${obj.deviceid}"`, function (error, results) {
            if (error) {
                callback(error, null)
            } else {
                callback(results, null)
            }
        })
    },
    updateDeviceParameter: function (obj, callback) {
        var sqlquery = `UPDATE devicetable SET `; 

        if(obj.alerttypetemp == 2){
            sqlquery += ` mintemprange = "${obj.tempMin}", maxtemprange = "${obj.tempMax}", alerttypetemp = 2, `;
        } 
        if(obj.alerttemp && obj.alerttypetemp != 2) {
            sqlquery +=`alerttemp = "${obj.alerttemp}", alerttypetemp = "${obj.alerttypetemp}", `;
        }
        if(obj.alerttypemoisture == 2 ){
            sqlquery +=` minmoistrange = "${obj.moistureMin}", maxmoistrange = "${obj.moistureMax}", alerttypemoisture = 2, `;
        } 
        if(obj.alertmoisture && obj.alerttypemoisture != 2 ) {
            sqlquery +=` alertmoisture = "${obj.alertmoisture}", alerttypemoisture = "${obj.alerttypemoisture}", `;
        } 
        if(obj.alerttypehumi == 2){
            sqlquery +=`  minhumirange = "${obj.humidityMin}", maxhumirange = "${obj.humidityMax}", alerttypehumi = 2, `;
        }  
        if(obj.alerthumi && obj.alerttypehumi != 2) {
            sqlquery +=` alerthumi = "${obj.alerthumi}", alerttypehumi = "${obj.alerttypehumi}", `;
        }
        sqlquery +=` devicestatus = 1 `;
        if(obj.checkList.length){ 
            sqlquery +=` WHERE deviceid IN(${ obj.checkList.map(item => [ ( "'"+ item.deviceid + "'" ) ] ) } )`;
        }
        db.query(sqlquery, function (error, result) {  //[obj.checkList.map(item => [ (item.deviceid) ] )], 

            if (error) {
                callback(error, null);
            }
            else {
                callback(result, null);
            }
        });
    },
    AlertHistory: function (obj, callback) {

        var limit = obj.limit || 10;
        var page = obj.page;
        var offset = (page * limit) - limit;
        var daterange =obj.datewise;
       
        if (daterange != "") {
            db.query('SELECT history_table.id as total FROM history_table  where userid=' + db.escape(obj.userid) + ' and  CAST(update_at as Date) =' + db.escape(daterange), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select * from history_table  where userid =' + db.escape(obj.userid) + ' and   CAST(update_at as Date) =' + db.escape(daterange) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        } else {
          
            db.query('SELECT history_table.id as total FROM history_table  where userid=' + db.escape(obj.userid), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));

                var sqlquery = 'select * from history_table  where userid =' + db.escape(obj.userid) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
                db.query(sqlquery, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {

                        var objdata = {
                            data: result,
                            totalpage: parseInt(total_pages),
                            totalrecoard: parseInt(data.length)
                        }

                        callback(objdata, null);
                    }
                });
            });
        }

    },
    AddComment: function (obj, callback) {

        var sqlquery = "INSERT INTO comment_device(`device_id`,`user_id`,`comment_text`,`status`) VALUES ('" + obj.device_id + "','" + obj.user_id + "','" + obj.comment_text + "','1')";
        db.query(sqlquery, function (error, result) {
            if (error) {
                throw error
            }
            else {
                callback(1, null);
            }
        });




    },
    commentlist: function (obj, callback) {
        db.query('SELECT * FROM comment_device WHERE user_id='+ db.escape(obj.user_id)+' AND device_id='+ db.escape(obj.device_id)+' order by id desc', function (error, results) {
            if (error) {
                throw error;
              //  callback(error, null)
            } else {
                callback(results, null)
            }
        })
    },
   // notify_temp
    devicenotifyoff: function (obj, callback) {
        if (obj.datatype == "temp") {
            var sqlquery = "UPDATE devicetable set notify_temp =" + 0 + " WHERE deviceid =" + db.escape(obj.deviceid);
            db.query(sqlquery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(1, null);
                }
            });

        }
        else if (obj.datatype == "humi") {
            var sqlquery = "UPDATE devicetable set notify_humi =" + 0 + " WHERE deviceid =" + db.escape(obj.deviceid);
            db.query(sqlquery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(1, null);
                }
            });
        }
        else if (obj.datatype == "moist") {
            var sqlquery = "UPDATE devicetable set notify_moist =" + 0 + " WHERE deviceid =" + db.escape(obj.deviceid);
            db.query(sqlquery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(1, null);
                }
            });
        } else {
            var sqlquery = "UPDATE devicetable set notify_fire =" + 0 + " WHERE deviceid =" + db.escape(obj.deviceid);
            db.query(sqlquery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(1, null);
                }
            });
        }

    },
    DashboardSocket: function (obj, callback) {
        db.query(`SELECT count(id) as 'totalDevice',
                    count(case when devicestatus=0 then 1 else null end) AS 'totalActive',
                    count(case when devicestatus=1 then 1 else null end) AS 'totalDeactive',
                    count(case when fire=1 or count_temp=1 or count_humi=1 or count_moist=1 then 1 else null end) AS acticeAlert,
                    (SELECT count(id) FROM Env.history_table WHERE Date(createdat) = curdate() AND userid=${obj.userid}) AS todayAlert
                    From Env.devicetable where userid=${obj.userid}`, function (error, data) {
            if (error) {
                callback(error, null);
            }
            else {
                db.query(`SELECT devicename,latitude,longitude,devicestatus FROM Env.devicetable WHERE userid=${obj.userid}`,
                    function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            let results = {
                                data,
                                deviceList: result
                            }

                            callback(results, null);
                        }
                    })
            }
        });
    }
}
module.exports = UserInfo;

