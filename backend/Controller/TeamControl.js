    const db = require('../DBConnection');
    var MemberFunc = {

        AddNewTeam: function (obj, callback) {

            let teamId = "TM-" + Math.random().toString(16).slice(2);
            var sqlquery = `INSERT INTO Env.teams SET 
            user_id          = '${obj.userid}', 
            team_id          = '${teamId}', 
            team_name        = '${obj.team_name}', 
            team_leader_name = '${obj.team_leader}', 
            location_id      = '${obj.location_id}' `;

            db.query(sqlquery, function (error, result) {
                if (error) {
                    throw error
                }
                else {
                    var sqlquery1 = `UPDATE Env.members SET team_id= '${teamId}' 
                        WHERE member_id IN(${ obj.members.map(item => [ ( "'"+item.value+"'" ) ] ) })`;

                    db.query(sqlquery1, function (error, result) {  
            
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            
                            let insertArr = [];
                            obj.members.forEach(element => {
                                insertArr.push( [ obj.userid, teamId, element.value ]);
                            });
                            var sqlquery2 = `INSERT INTO Env.member_alloted_histroys (user_id, team_id, member_id) VALUES ? `; 
                            db.query(sqlquery2, [insertArr], (err, result) => {
                                if (err) throw err
                            })
                            callback(100, null);
                        }
                    }); 
                }
            });

        },
        TeamList : function (obj, callback) {
            
            var limit  = obj.limit || 10;
            var page   = obj.page;
            var offset = (page * limit) - limit;
            
            db.query('SELECT count(id) as total FROM teams where user_id=' + db.escape(obj.userid), function (error, data) {
                if (error) throw error;

                var total_pages = Math.ceil(parseInt(data[0].total) / parseInt(limit));
                
                var sqlquery = `select team_id, team_name, 
                    (select CONCAT(first_name, " ",last_name) from members where members.member_id = teams.team_leader_name) as team_leader, 
                    (select CONCAT(email, "__",mobile_no) from members where members.member_id = teams.team_leader_name) as team_leader_data, 
                    (select AreaName from area where area.AreaNumber = teams.location_id limit 1) as location_name   
                    from teams`;
                
                sqlquery += ' where user_id =' + db.escape(obj.userid) + ' order by id desc LIMIT ' + limit + ' OFFSET ' + offset;
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
        teamDetails : function (obj, callback) {

            var sqlquery = `select team_id, team_name, team_leader_name, location_id, 
            (select CONCAT(first_name, " ",last_name) from members where members.member_id = teams.team_leader_name) as team_leader, 
            (select CONCAT(email, "__",mobile_no) from members where members.member_id = teams.team_leader_name) as team_leader_data, 
            (select AreaName from area where area.AreaNumber = teams.location_id) as location_name,
            (select count(id) from members where members.team_id = teams.team_id) as member_count,
            (select count(id) from team_alloted_histroys as th where th.team_id = teams.team_id) as alloted_count
            from teams where team_id = ${db.escape(obj.teamId)}`;

            db.query(sqlquery, function (error, result) { 
                if (error) {
                    callback(error, null);
                }
                else { 
                    callback(result[0], null);
                    
                }
            });
        },
        EditTeam: function (obj, callback) {

            var sqlquery = `UPDATE Env.teams SET 
            team_name        = '${obj.team_name}', 
            team_leader_name = '${obj.team_leader}', 
            location_id      = '${obj.location_id}' where team_id = '${obj.team_id}' `;

            db.query(sqlquery, function (error, result) {
                if (error) {
                    throw error
                }
                else {
                    var sqlquery1 = `UPDATE Env.members SET team_id= '${obj.team_id}' 
                        WHERE member_id IN(${ obj.members.map(item => [ ( "'"+item.value+"'" ) ] ) })`;

                    db.query(sqlquery1, function (error, result) {  
            
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            callback(100, null);
                        }
                    }); 
                }
            });

        },
        allotedMembersHistory : function (obj, callback) {
            
            var sqlquery = `select member_id, (select CONCAT(first_name, " ",last_name) from members where members.member_id = member_alloted_histroys.member_id) as member_name,
            (select work_type from members where members.member_id = member_alloted_histroys.member_id) as work_type,
            (select official_email from members where members.member_id = member_alloted_histroys.member_id) as official_email,
            (select official_mobile_no from members where members.member_id = member_alloted_histroys.member_id) as official_mobile_no,
            (select team_id from member_alloted_histroys as ma where ma.member_id = member_alloted_histroys.member_id order by id desc limit 1,1) as prev_team_id,
            (select team_name from teams where teams.team_id = prev_team_id) as team_name from member_alloted_histroys where team_id =${db.escape(obj.teamId)} order by id desc limit 20`;

            db.query(sqlquery, function (error, result) { 
                if (error) {
                    callback(error, null);
                }
                else {  
                    callback(result, null);
                }
            });
            
        },
        teamMembers : function(obj, callback){
            var sqlquery1 = `select member_id, (select CONCAT(first_name, " ",last_name) ) as full_name from members where team_id =${db.escape(obj.teamId)}`;
            
            db.query(sqlquery1, function (error, dataa) { 
                if (error) {
                    callback(error, null);
                }
                callback(dataa) ;
            });
        },
        allTeamList : function (obj, callback) {
            
            var sqlquery = `select team_id as value, team_name as label from teams where user_id=${db.escape(obj.userid)} order by team_name asc`;
            db.query(sqlquery, function (error, result) { 
                if (error) {
                    callback(error, null);
                }
                else {  
                    callback(result, null);
                }
            });
        },
        alloteTeam: function (obj, callback) {
            console.log('obj', obj);
            var sqlquery = `INSERT INTO Env.team_alloted_histroys SET 
            user_id   = '${obj.userid}', 
            team_id   = '${obj.teamID}', 
            device_id = '${obj.deviceId}'`;

            db.query(sqlquery, function (error, result) {
                if (error) {
                    throw error
                }
                else {
                    
                    callback(100, null);
                }
            });

        },
    }
    module.exports = MemberFunc;

