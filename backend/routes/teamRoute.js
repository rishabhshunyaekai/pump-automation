    const express     = require('express');
    const router      = express.Router();
    const teamFunc  = require('../Controller/TeamControl');

    var validation  = (obj) => {
        const var_obj = {
            team_name       : 'Team name is required',
            location_id     : 'Please select location',
            members         : 'Please select members',
            team_leader     : 'Please select team leader',
            team_leader_id  : 'Team Leader Email is required',
            team_leader_mob : 'Team Leader mobile is required',
        }
        let errObj = [];
        for (const prop in var_obj) {
            if(obj[prop] === undefined || obj[prop] == ''){
                let objj   = {};
                objj[prop] = var_obj[prop];
                errObj.push(objj);
            }
        }
        return errObj;
    } 
    router.post('/v1/add-team', async (req, res) => {
        
        var errObj = validation(req.body);
        if(errObj.length){
            res.status(200).send({  success : false, code : 419, message : 'All fields are required',  errObj });
            return;
        }
        teamFunc.AddNewTeam(req.body, (result) => {
            if(result == 100){
                res.status(200).send({ success : true, message : "Team Added Successfully!!", code : 200, });

            } else {
                res.status(200).send({ success : false, message : "Something wrong", code : 200, })
            }
        });
    });

    router.post('/v1/teamList', function (req, res) {
        
        teamFunc.TeamList(req.body, result => {
            
            const results = {
                dataList     : result.data,
                totalpage    : result.totalpage,
                totalrecoard : result.totalrecoard
            };
            res.status(200).send({ success: true, message: 'Success!', results });
        });
    });
    router.post('/v1/teamDetails', function (req, res) {
        
        teamFunc.teamDetails(req.body, result => {
            
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    router.post('/v1/teamAllotedHistory', function (req, res) {
        
        teamFunc.allotedMembersHistory(req.body, result => {
            
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    router.post('/v1/teamMembers', function (req, res) {
        
        teamFunc.teamMembers(req.body, result => {
            
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });

    router.post('/v1/edit-team', async (req, res) => {
        
        var errObj = validation(req.body);
        if(errObj.length){
            res.status(200).send({  success : false, code : 419, message : 'All fields are required',  errObj });
            return;
        }
        teamFunc.EditTeam(req.body, (result) => {
            if(result == 100){
                res.status(200).send({ success : true, message : "Team Updated Successfully!!", code : 200, });

            } else {
                res.status(200).send({ success : false, message : "Something wrong", code : 200, })
            }
        });
    });

    router.post('/v1/allTeamList', function (req, res) {
        
        teamFunc.allTeamList(req.body, results => {
            
            res.status(200).send({ success: true, message: 'Success!', results });
        });
    });
    router.post('/v1/alloteTeam', async (req, res) => {
        
        console.log('body', req.body);
        // res.status(200).send({  success : false, code : 419, message : 'All fields are required', });
        // return;
        teamFunc.alloteTeam(req.body, (result) => {
            if(result == 100){
                res.status(200).send({ success : true, message : "Team Alloted Successfully!!", code : 200, });

            } else {
                res.status(200).send({ success : false, message : "Something wrong", code : 200, })
            }
        });
    });

    

    module.exports = router;
