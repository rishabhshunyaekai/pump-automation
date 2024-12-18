    const express  = require('express');
    const router   = express.Router();
    const UserInfo = require('../Controller/EnvControl');
    const bcrypt   = require("bcryptjs");
    const verify   = require('../helper/common');
    const { exec } = require('child_process');

    router.post('/v1/signup', async (req, res) => {

        if (req.body.name == '' || req.body.name == undefined) {
            res.status(200).send({ success: false, message: "Please Enter First Name" })
        }
        else if (req.body.name.length <= 2) {
            res.status(200).send({ success: false, message: "First Name must be 3 char" })
        }
        else if (req.body.email == '' || req.body.email == undefined) {
            res.status(200).send({ success: false, message: "Email is required!" })
        }
        else if (!verify.validate(req.body.email)) {
            res.status(200).send({ success: false, message: "Invalid Email ID, Please Enter Valid Email!!!" })
        }
        else if (req.body.userpassword == '' || req.body.userpassword == undefined) {
            res.status(200).send({ success: false, message: "Password is required!" })
        }
        else if (req.body.confirmpassword != req.body.userpassword) {
            res.status(200).send({ success: false, message: "Confirm Password does not equal to Password!" })
        }

        else if (req.body.mobileno == '' || req.body.mobileno == undefined) {
            res.status(200).send({ success: false, message: "Mobile Number is required!" })
        }
        else {
            let obj = { ...req.body }
            await (() => {
                UserInfo.AddNewUser(obj, (result) => {
                    if (result == 0) {
                        res.status(200).send({ success: false, message: "Email is already Used.. Please enter another email!!" })
                    }
                    else {
                        res.status(200).send({ success: true, message: "Successfully!!" })
                    }
                });
            })()


        }

    })
    // @route   POST /login
    // @desc    User login
    // @access  Public
    router.post('/v1/login', async (req, res) => {

        if (req.body.email == '' || req.body.email == undefined) {
            res.status(200).send({ success: false, message: "Email is required!" })
        }

        else if (req.body.userpassword == '' || req.body.userpassword == undefined) {
            res.status(200).send({ success: false, message: "Password is required!" })
        }
        else {
            let obj = { ...req.body }

            UserInfo.Login(obj, (result) => {
                if (result == 0) {
                    res.status(200).json({ success: false, message: "User does not exist" });
                }
                else {
                    (async () => {
                        const validPassword = await bcrypt.compare(obj.userpassword, result.userpassword);
                        if (validPassword) {
                            let payload = {
                                id: result.id,
                                name: result.name,
                                email: result.email,
                                mobileno: result.mobileno,
                                photo: result.photo,
                                usertype: result.usertype,
                                userstatus: result.userstatus,

                            }
                            res.status(200).send({ success: true, message: 'Successfully Login!', payload });
                        } else {
                            res.status(200).json({ success: false, message: "Invalid Password!" });
                        }

                    })();
                }

            });
        }
    });
    // @route   POST /add-device
    // @desc    New Device Register
    // @access  Public
    router.post('/v1/add-device', async (req, res) => {

        if (req.body.devicename == '' || req.body.devicename == undefined) {
            res.status(200).send({ success: false, message: "Please Enter Device Name" })
        }
        else if (req.body.devicename.length <= 2) {
            res.status(200).send({ success: false, message: "Device Name must be 3 char" })
        }
        else if (req.body.deviceid == '' || req.body.deviceid == undefined) {
            res.status(200).send({ success: false, message: "Device Id is required!" })
        }
        else if (req.body.userid == '' || req.body.userid == undefined) {
            res.status(200).send({ success: false, message: "User Id is required!" })
        }
        else if (req.body.areaid == '' || req.body.areaid == undefined) {
            res.status(200).send({ success: false, message: "Area is required!" })
        }
        else if (req.body.latitude == '' || req.body.latitude == undefined) {
            res.status(200).send({ success: false, message: "latitude Number is required!" })
        }
        else if (req.body.longitude == '' || req.body.longitude == undefined) {
            res.status(200).send({ success: false, message: "longitude Number is required!" })
        }
        else {
            let obj = { ...req.body }
            await (() => {
                UserInfo.AddNewDevice(obj, (result) => {
                    if (result == 0) {
                        res.status(200).send({ success: false, message: "Device ID is already Used.. Please enter another Device ID!!" })
                    }
                    else {
                        res.status(200).send({ success: true, message: "Successfully!!" })
                    }
                });
            })()

        }
    })
    // @route   GET /areaList
    // @desc    Area All List with pagination
    // @access  Public

    router.post('/v1/deviceList', function (req, res) {
        
        //if(req.body.page & req.body.userid){
        UserInfo.DeviceList(req, result => {
            const results = {
                deviceList: result.data,
                totalpage: result.totalpage,
                totalrecoard: result.totalrecoard
            };
            res.status(200).send({ success: true, message: 'Success!', results });

        });
        // } 
        // else {
        //     areaManagementCtrl.allAreaList(req, result => {  
        //         res.status(200).send({ success:true,message: 'Success!',result});

        //     });
        
        // }

    });
    router.post('/v1/deviceareaList', function (req, res) {

        UserInfo.deviceAreaBase({ areaid: req.body.areaid }, result => {
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    router.post('/v1/devicedelete', function (req, res) {

        UserInfo.deletedevice({ id: req.body.id }, result => {
            if (result == 1) {
                res.status(200).send({ success: true, message: 'Delete Device Successfully!' });

            } else {
                res.status(200).send({ success: false, message: 'Something is missing!' });

            }
        });
    });
    router.post('/v1/deviceupdate', function (req, res) {
        
        UserInfo.updateNewDevice(req.body, result => {
            if (result == 1) {
                res.status(200).send({ success: true, message: 'Update Device Successfully!' });

            } else {
                res.status(200).send({ success: false, message: 'Something is missing!' });

            }
        });
    });
    router.post('/v1/reassigndevice', function (req, res) {

        if (req.body.areaid == "") {
            res.json({ message: "Area Id is missing" });

        } else if (req.body.id == "") {
            res.json({ message: "id is missing" });

        } else if (req.body.lat == "") {
            res.json({ message: "lat is missing" });

        } else if (req.body.lng == "") {
            res.json({ message: "lng is missing" });

        } else {
            let obj = { ...req.body }
            UserInfo.deviceAreaUpdate(obj, result => {
                if (result == 1) {
                    res.status(200).send({ success: true, message: 'Re-assign Device Successfully!' });

                } else {
                    res.status(200).send({ success: false, message: 'Something is missing!' });

                }
            });
        }
    });
    router.post('/v1/devicedetails', function (req, res) {

        UserInfo.deviceAreaInfoDetails({ deviceid: req.body.deviceid, userid: req.body.userid }, result => {
            if (result) {
                res.status(200).send({ success: true, message: 'found data!', result: result });
            } else {
                res.status(200).send({ success: false, message: 'not found data!' });
            }

        });
    });
    router.post('/v1/devicealertList', function (req, res) {
        UserInfo.deviceAlertHistory((req), result => {
            if (result.data.length === 0) {
                return res.status(200).send({ success: false, message: 'not found data!!' });

            }
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    router.post('/v1/sigleDevice', function (req, res) {
        UserInfo.singleDevice(req.body, result => {
            res.status(200).send({ success: true, message: 'Success!', result });
        });
    });
    router.post("/v1/deviceparameter", function (req, res) {
        UserInfo.updateDeviceParameter(req.body, result => {
            res.status(200).send({ success: true, message: 'Device Parameter Update Successfully.', result });
        });
    })
    router.post('/v1/comment_device', function (req, res) {
        let { device_id, user_id, comment_text } = req.body;
        if (device_id == "" || user_id == "" || comment_text == "") {
            res.status(200).send({ success: false, message: 'something is missing' });
        } else {
            UserInfo.AddComment(req.body, result => {
                res.status(200).send({ success: true, message: 'Success!', result });
            });
        }

    });
    router.post('/v1/commentlist', function (req, res) {
        let { device_id, user_id } = req.body;
        if (device_id == "" || user_id == "") {
            res.status(200).send({ success: false, message: 'something is missing' });
        } else {
            UserInfo.commentlist(req.body, result => {
                res.status(200).send({ success: true, message: 'Success!', result });
            });
        }
    });
    router.post('/v1/closeNotify', function (req, res) {

        UserInfo.devicenotifyoff({ deviceid: req.body.deviceid, datatype: req.body.datatype }, result => {

            if (result == 1) {
                res.status(200).send({ success: true, message: 'Close Notification!' });
            } else {
                res.status(200).send({ success: false, message: 'Something is missing!' });
            }

        });
    });

    // router.get("/restart-server",
    //     exec(`forever restartall`,
    //         async (err, output) => {
    //             if (err) {
    //                 console.error("could not execute command: ", err);
    //                 return;
    //             }

    //             return res.status(201).json({
    //                 status: "success",
    //                 message: "restart",
    //             });
    //         }
    //     )
    // )

    router.get('/data', function(req, res, next) {

        let io = req.app.get('socketio');
        const updatedData="" ;
        io.on('connection', socket => {
            console.log('A user connected');
        
            // Send updated data every second
            setInterval(() => {
            // Your logic to update the data
            updatedData = { data: "updated" };
        
            // Emit the updated data to the client
            socket.emit("updated_data", updatedData);
        
            }, 1000);
        
            socket.on('disconnect', () => {
            console.log('A user disconnected');
            });
        });
        
        res.json({ success: true ,updatedData});


    
    //  io.to(socket.id).emit("message", datetime);

    //     db.rides.find(function(err, docs) {
        
    //     })
    });

    module.exports = router;