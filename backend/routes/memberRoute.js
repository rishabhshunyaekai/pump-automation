    const express     = require('express');
    const router      = express.Router();
    const MemberFunc  = require('../Controller/MemberControl');

    var multer = require('multer');
    var upload = multer({dest:'uploads/member_files/'});
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/member_files');
        },
        filename: function (req, file, cb) {
            //cb(null , file.originalname);
            const ext = file.mimetype.split("/")[1];
            cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
        }
    });
    var upload = multer({ storage: storage });  
    const cpUpload = upload.fields([
        { name : 'passport', maxCount  : 2 }, 
        { name : 'emirates', maxCount  : 2 },
        { name : 'visa_file', maxCount : 2 },
        { name : 'insurance', maxCount : 2 }
    ]);

    var validation  = (obj) => {
        const var_obj = {
            userid                : 'User Id is required',
            first_name            : 'First name is required',
            last_name             : 'Last name is required',
            email                 : 'Email is required',
            mobile_no             : 'Mobile no is required',
            official_email        : 'Official Email is required',
            official_mobile_no    : 'Offcial Mobile no is required',
            designation           : 'Designation is required',
            work_type             : 'Work type is required',
            passport_expiry_date  : 'Passport expiry date is required',
            emirates_expiry_date  : 'Emirates expiry date is required',
            visa_expiry_date      : 'Visa expiry date is required',
            insurance_expiry_date : 'Insurance expiry date is required',
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
    router.post('/v1/add-member', cpUpload, async (req, res) => {
        
        var errObj = validation(req.body);
        if(errObj.length){
            res.status(200).send({  success : false, code : 419, message : 'All fields are required',  errObj });
            return;
        }
        if(req.files.passport === undefined || req.files.passport.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Passport file is required' });
            return;
        } 
        if(req.files.emirates === undefined || req.files.emirates.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Emirates Id file is required' });
            return;
        } 
        if(req.files.visa_file === undefined || req.files.visa_file.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Visa file is required' });
            return;
        } 
        if(req.files.insurance === undefined || req.files.insurance.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Insurance file is required' });
            return;
        } 
        var filesPassport  = ( req.files.passport.map(item => item['filename']) ).join('*');
        var filesEmirates  = ( req.files.emirates.map(item => item['filename']) ).join('*');
        var filesVisaFile  = ( req.files.visa_file.map(item => item['filename']) ).join('*');
        var filesInsurance = ( req.files.insurance.map(item => item['filename']) ).join('*');

        var obj = {
            ...req.body,
            filesPassport  : filesPassport,
            filesEmirates  : filesEmirates,
            filesVisaFile  : filesVisaFile,
            filesInsurance : filesInsurance
        }
        MemberFunc.AddNewMember(obj, (result) => {
            if(result == 211){

                res.status(200).send({ 
                    success : false, 
                    code    : 200,
                    message : "Personal Email Id already in Used.. Please enter another Email ID !!" 
                });
            } else if(result == 212){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Personal Mobile no already in Used.. Please enter another Mobile no !!" 
                });
            } else if(result == 221){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Official Email Id already in Used.. Please enter another Email ID !!" 
                });
            } else if(result == 222){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Official Mobile no already in Used.. Please enter another Mobile no !!" 
                });
            } else if(result == 100){
                res.status(200).send({ success : true, message : "Member Added Successfully!!", code : 200, });

            } else {
                res.status(200).send({ success : false, message : "Something wrong", code : 200, })
            }
        });
    });

    router.post('/v1/memberList', function (req, res) {
        
        MemberFunc.MemberList(req.body, result => {
            if( Object.keys(req.body).length < 2 ) { 


                res.status(200).send({ success: true, message: 'Success!',  dataList : result });

            } else {
                const results = {
                    dataList     : result.data,
                    totalpage    : result.totalpage,
                    totalrecoard : result.totalrecoard
                };
                res.status(200).send({ success: true, message: 'Success!', results });
            }
        });
    });
    router.post('/v1/memberDetails', function (req, res) {
        
        MemberFunc.MemberDetails(req.body, result => {
            
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });

    router.post('/v1/edit-member', cpUpload, async (req, res) => {
        
        var errObj = validation(req.body);
        if(errObj.length){
            res.status(200).send({  success : false, code : 419, message : 'All fields are required', errObj });
            return;
        }
        if(req.files.passport !== undefined && req.files.passport.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Passport file is required' });
            return;
        } 
        if(req.files.passport !== undefined && req.files.passport.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Emirates Id file is required' });
            return;
        } 
        if(req.files.passport !== undefined && req.files.passport.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Visa file is required' });
            return;
        } 
        if(req.files.passport !== undefined && req.files.passport.length == 0 ){
            res.status(200).send({  success : false, code : 200, message : 'Insurance file is required' });
            return;
        } 
        var filesPassport  = (req.files.passport !== undefined) ? (req.files.passport.map(item => item['filename']) ).join('*') :'';
        var filesEmirates  = (req.files.emirates !== undefined) ? ( req.files.emirates.map(item => item['filename']) ).join('*') :'';
        var filesVisaFile  = (req.files.visa_file !== undefined) ? ( req.files.visa_file.map(item => item['filename']) ).join('*') :'';
        var filesInsurance = (req.files.insurance !== undefined) ? ( req.files.insurance.map(item => item['filename']) ).join('*') :'';

        var obj = {
            ...req.body,
            filesPassport  : filesPassport,
            filesEmirates  : filesEmirates,
            filesVisaFile  : filesVisaFile,
            filesInsurance : filesInsurance
        }
        MemberFunc.EditMember(obj, (result) => {
            if(result == 211){

                res.status(200).send({ 
                    success : false, 
                    code    : 200,
                    message : "Personal Email Id already in Used.. Please enter another Email ID !!" 
                });
            } else if(result == 212){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Personal Mobile no already in Used.. Please enter another Mobile no !!" 
                });
            } else if(result == 221){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Official Email Id already in Used.. Please enter another Email ID !!" 
                });
            } else if(result == 222){
                res.status(200).send({ 
                    success : false,
                    code    : 200, 
                    message : "Official Mobile no already in Used.. Please enter another Mobile no !!" 
                });
            } else if(result == 100){
                res.status(200).send({ success : true, message : "Member Updated Successfully!!", code : 200, });

            } else {
                res.status(200).send({ success : false, message : "Something wrong", code : 200, })
            }
        });
    });
    
    router.post('/v1/memberAllotedHistory', function (req, res) {
        
        MemberFunc.memberAllotedHistory(req.body, result => {
            
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    


    module.exports = router;
