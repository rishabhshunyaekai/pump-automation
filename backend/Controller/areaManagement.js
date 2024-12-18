const db = require('../DBConnection');
var _ = require("underscore");
var areaManagement = {

    addareaNewdata: function (obj, callback) {
        var sqlquery = "insert into area (user_id, AreaName,AreaNumber,shapetype,lat,lng,`redius`) VALUES ?";
        db.query(sqlquery, [obj.map(item => [item.userid, item.AreaName, item.AreaNumber, item.shapetype, item.lat, item.lng, item.redius])], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(result, null);
            }
        });
    },
    areaList: function (obj, callback) {
        var limit = obj.body.limit || 10;
        var page = obj.body.page;
        var offset = (page * limit) - limit;
        db.query('SELECT id as total FROM area where user_id=' + db.escape(obj.body.userid) + ' group by AreaNumber ', function (error, data) {
            if (error) throw error;
            var total_pages = Math.ceil(parseInt(data.length) / parseInt(limit));
            var sqlquery = `SELECT ar.AreaNumber,ar.AreaName,count(deviceid) as 'totalDevice',
                            count(case when devicestatus=1 then 1 else null end) as 'totalDeactive',
                            count(case when devicestatus=0 then 1 else null end) as 'totalActive'
                            from Env.area as ar 
                            left join Env.devicetable as dt on 
                            ar.AreaNumber=dt.areaid  where user_id=${db.escape(obj.body.userid)} group by ar.AreaNumber LIMIT ${limit} OFFSET ${offset}`
            db.query(sqlquery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    var obj = {
                        data: result,
                        totalpage: parseInt(total_pages),
                        totalrecoard: parseInt(data.length)
                    }
                    callback(obj, null);
                }
            });
        });
    },
    allAreaList: function (req, callback) {
        var sqlquery = 'select * from area where user_id =  ' + db.escape(req.body.userid) + ' group by AreaNumber order by id desc';
        db.query(sqlquery, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var obj = { areaList: result }
                callback(obj, null);
            }
        });

    },
    areasingleData: function (areanumber, callback) {
        var sqlquery = "select * from area where AreaNumber=?";
        // var sqlquery = "SELECT dt.* FROM Env.devicetable As dt INNER JOIN Env.area As ar ON ar.AreaNumber = dt.areaid AND ar.AreaNumber = ?";
        db.query(sqlquery, [areanumber], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(result, null);
            }
        });
    },
    // areawiseDeviceDetails: function (obj, callback) {
    //     let { userid, areanumber } = obj.body
    //     var sqlquery = `SELECT ar.*, count(AreaNumber) as 'totalDevice',
    //             count(case when devicestatus=1 then 1 else null end) as 'totalDeactive',
    //             count(case when devicestatus=0 then 1 else null end) as 'totalActive'
    //             from Env.area as ar inner join Env.devicetable as dt on 
    //             ar.AreaNumber=dt.areaid where ar.user_id=? and ar.AreaNumber=?`;
    //     db.query(sqlquery, [userid, areanumber], function (error, data) {
    //         if (error) {
    //             callback(error, null);
    //         }
    //         else {
    //             
    //             sqlquery = `SELECT dt.* FROM Env.devicetable As dt INNER JOIN Env.area As ar ON ar.AreaNumber = dt.areaid AND ar.AreaNumber = ?`
    //             db.query(sqlquery, [areanumber], function (error, result) {
    //                 if (error) {
    //                     callback(error, null);
    //                 }
    //                 else {
    //                     var obj = {
    //                         data: data,
    //                         deviceList: result
    //                     }
    //                     callback(obj, null);
    //                 }
    //             });
    //         }
    //     });
    // }
}
module.exports = areaManagement;

