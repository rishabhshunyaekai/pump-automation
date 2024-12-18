const db = require('../DBConnection');

var MemberFunc = {
   
    AddNewMember: function (obj, callback) {

        var sqlquery = `SELECT id, 
            (select count(id) from members where email='${obj.email}' ) as emailCount, 
            (select count(id) from members where mobile_no='${obj.mobile_no}' ) as mobCount,
            (select count(id) from members where official_email='${obj.official_email}' ) as ofcEmailCount,
            (select count(id) from members where official_mobile_no='${obj.official_mobile_no}' ) as ofcMobCount 
            from members limit 1`;

        db.query(sqlquery, function (error, results) {
            if (error) {  
                throw error;
            }
            else {
              
                if (results.length && results[0].emailCount) { 
                    callback(211, null);

                } else if (results.length && results[0].mobCount) { 
                    callback(212, null);

                } else if (results.length && results[0].ofcEmailCount) { 
                    callback(221, null);

                } else if (results.length && results[0].ofcMobCount) { 
                    callback(222, null);

                } else {
                    let memberId = "MBR-" + Math.random().toString(16).slice(2);
                    var sqlquery = `INSERT INTO Env.members SET 
                    user_id               = '${obj.userid}', 
                    member_id             = '${memberId}', 
                    first_name            = '${obj.first_name}', 
                    last_name             = '${obj.last_name}', 
                    email                 = '${obj.email}', 
                    mobile_no             = '${obj.mobile_no}', 
                    official_email        = '${obj.official_email}', 
                    official_mobile_no    = '${obj.official_mobile_no}', 
                    designation           = '${obj.designation}', 
                    work_type             = '${obj.work_type}', 
                    passport_expiry_date  = '${obj.passport_expiry_date}', 
                    emirates_expiry_date  = '${obj.emirates_expiry_date}', 
                    visa_expiry_date      = '${obj.visa_expiry_date}', 
                    insurance_expiry_date = '${obj.insurance_expiry_date}', 
                    
                    passport       = '${obj.filesPassport}',
                    emirates_id    = '${obj.filesEmirates}',
                    visa_file      = '${obj.filesVisaFile}',
                    insurance_file = '${obj.filesInsurance}'`;

                    db.query(sqlquery, function (error, result) {
                        if (error) {
                            throw error
                        }
                        else {
                            callback(100, null);
                        }
                    });
                }
            }
        });

    },
    MemberList : function (obj, callback) {
        
        if( Object.keys(obj).length < 2 ){ 
            db.query('SELECT member_id, first_name, last_name, official_email, official_mobile_no FROM members where user_id=' + db.escape(obj.userid)+' order by first_name asc', function (error, data) { 
                if (error) throw error;

                callback({data}, null);
                
            });
            return;
        }
        var limit  = obj.limit || 10;
        var page   = obj.page;
        var offset = (page * limit) - limit;
        
        db.query('SELECT count(id) as total FROM members where user_id=' + db.escape(obj.userid), function (error, data) {
            if (error) throw error;

            var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(limit));

            var sqlquery = 'select member_id, first_name, last_name, official_email, official_mobile_no, work_type, designation, team_id, (select team_name from teams where teams.team_id = members.team_id) as team_name from members where user_id =' + db.escape(obj.userid) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
            db.query(sqlquery, function (error, result) { //team_name
                if (error) {
                    callback(error, null);
                }
                else {  
                    var objdata = {
                        data         : result,
                        totalpage    : parseInt(total_pages),
                        totalrecoard : parseInt(data[0].total)
                    }
                    callback(objdata, null);
                }
            });
        });
    },
    MemberDetails : function (obj, callback) {
        //var memberId  = obj.body.memberId;
        var sqlquery = `select members.*,  (select team_name from teams where teams.team_id = members.team_id) as team_name 
            from members where member_id = ${db.escape(obj.memberId)}`;

        db.query(sqlquery, function (error, result) { 
            if (error) {
                callback(error, null);
            }
            else {  
                callback(result[0], null);
            }
        });
        
    },
    EditMember: function (obj, callback) {

        var sqlquery = `SELECT id, 
            (select count(id) from members where email='${obj.email}' and member_id !='${obj.member_id}') as emailCount, 
            (select count(id) from members where mobile_no='${obj.mobile_no}' and member_id !='${obj.member_id}' ) as mobCount,
            (select count(id) from members where official_email='${obj.official_email}' and member_id !='${obj.member_id}' ) as ofcEmailCount,
            (select count(id) from members where official_mobile_no='${obj.official_mobile_no}' and member_id !='${obj.member_id}' ) as ofcMobCount 
            from members limit 1`;

        db.query(sqlquery, function (error, results) { 
            if (error) {  
                throw error;
            }
            else {
              
                if (results.length && results[0].emailCount) { 
                    callback(211, null);

                } else if (results.length && results[0].mobCount) { 
                    callback(212, null);

                } else if (results.length && results[0].ofcEmailCount) { 
                    callback(221, null);

                } else if (results.length && results[0].ofcMobCount) { 
                    callback(222, null);

                } else {
                    
                    var sqlquery = `UPDATE Env.members SET 
                    first_name            = '${obj.first_name}', 
                    last_name             = '${obj.last_name}', 
                    email                 = '${obj.email}', 
                    mobile_no             = '${obj.mobile_no}', 
                    official_email        = '${obj.official_email}', 
                    official_mobile_no    = '${obj.official_mobile_no}', 
                    designation           = '${obj.designation}', 
                    work_type             = '${obj.work_type}', 
                    passport_expiry_date  = '${obj.passport_expiry_date}', 
                    emirates_expiry_date  = '${obj.emirates_expiry_date}', 
                    visa_expiry_date      = '${obj.visa_expiry_date}', 
                    insurance_expiry_date = '${obj.insurance_expiry_date}',`;

                    if(obj.filesPassport){
                        sqlquery += ` passport = '${obj.filesPassport}', `;
                    }
                    if(obj.filesEmirates){
                        sqlquery += ` emirates_id = '${obj.filesEmirates}', `;
                    }
                    if(obj.filesVisaFile){
                        sqlquery += ` visa_file = '${obj.filesVisaFile}', `;
                    }
                    if(obj.filesInsurance){
                        sqlquery += ` insurance_file = '${obj.filesInsurance}', `;
                    }
                    sqlquery += ` user_id = '${obj.userid}' where member_id = '${obj.member_id}'`;

                    db.query(sqlquery, function (error, result) {
                        if (error) {
                            throw error
                        }
                        else {
                            callback(100, null);
                        }
                    });
                }
            }
        });

    },
    memberAllotedHistory : function (obj, callback) {
       
        var sqlquery = `select member_id, created_at, (select CONCAT(first_name, " ",last_name) from members where members.member_id = member_alloted_histroys.member_id) as member_name,
        (select team_id from member_alloted_histroys as ma where ma.member_id = member_alloted_histroys.member_id order by id desc limit 1,1) as prev_team_id,
        (select team_name from teams where teams.team_id = prev_team_id) as prev_team_name,
        (select team_name from teams where teams.team_id = member_alloted_histroys.team_id) as cur_team_name,
        (select location_id from teams where teams.team_id = member_alloted_histroys.team_id) as location_id,

        (select AreaName from area where area.AreaNumber = location_id limit 1) as location_name 
        from member_alloted_histroys where member_id =${db.escape(obj.memberId)} order by id desc limit 20`;

        db.query(sqlquery, function (error, result) { 
            if (error) {
                callback(error, null);
            }
            else {  
                callback(result, null);
            }
        });
    },
    
}
module.exports = MemberFunc;

