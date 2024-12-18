    const express            = require('express');
    const router             = express.Router();
    const areaManagementCtrl = require('../Controller/areaManagement');
    var _                    = require("underscore");
    const UserInfo           = require('../Controller/EnvControl');
    //const users              = new Map(); // A map to store user states

    module.exports = function (io) {
        // @route   POST /addArea
        // @desc    Add Register New Area
        // @access  Public
        router.post('/v1/addArea', function (req, res) {
            
            if (req.body.myArray.length > 0) {
                areaManagementCtrl.addareaNewdata(req.body.myArray, result => {
                    res.status(200).send({ success: true, message: 'Successfully Added!', result });
                });
            } else {
                res.status(200).send({ success: false, message: "invalid Data" });
            }
        });
        router.post('/v1/areaList', function (req, res) {
            if (req.body.page) {
                areaManagementCtrl.areaList(req, result => {
                    const results = {
                        areaList     : result.data,
                        totalpage    : result.totalpage,
                        totalrecoard : result.totalrecoard
                    };
                    res.status(200).send({ success: true, message: 'Success!', results });
                });
            }
            else {
                areaManagementCtrl.allAreaList(req, result => {
                    res.status(200).send({ success: true, message: 'Success!', result });
                });
            }
        });
        router.post('/v1/areaSingle', function (req, res) {
            areaManagementCtrl.areasingleData(req.body.areanumber, result => {
                const results = {
                    areaList: Object.values(
                        result.reduce((acc, { AreaName, AreaNumber, shapetype, lat, lng, status, redius }) => {
                            (acc[AreaNumber] = acc[AreaNumber] || { AreaName, AreaNumber, shapetype, redius, status, List: [] })
                                .List.push({ lat, lng });
                            return acc;
                        }, {})
                    )
                };
                res.status(200).send({ success: true, message: 'Success!', results: results.areaList[0] });
            });
        });
        let interval2 = 0;
        let arr       = [];
        io.on('connection', function (socket) {
            socket.on("onrealtimedata", (data) => {

                if (interval2) {
                    clearInterval(interval2);
                }
                socket.join(data.userId);
                interval2 =  setInterval(()=>{
                
                    UserInfo.DeviceListSocket({
                        userid       : data.userId, 
                        page         : data.currentPage, 
                        limit        : data.limit,
                        areanumber   : data.areanumber, 
                        devicestatus : data.devicestatus
                    }, result => {
                        let results = ({
                            deviceList   : result.data,
                            totalpage    : result.totalpage,
                            totalrecoard : result.totalrecoard
                        }); 
                        io.in(data.userId).emit("deviceData", results); // deviceData
                    });
                },1000)
                socket.on("disconnect", () => {
                    clearInterval(interval2);
                });
            })
            return;
        });
        let interval = 0;
        io.on('connection', function (socket) {
            socket.on("onactivedata", (data) => {
                if (interval) {
                    clearInterval(interval);
                }
                socket.join(data.userId);
                interval = setInterval(() => {

                    UserInfo.DeviceListActiveSocket({
                        userid       : data.userId, 
                        page         : data.currentPage, 
                        limit        : data.limit,
                        areanumber   : data.areanumber, 
                        devicestatus : data.devicestatus
                    }, result => {
                    
                        let results = {
                            deviceList   : result.data,
                            totalpage    : result.totalpage,
                            totalrecoard : result.totalrecoard
                        };
                        io.in(data.userId).emit("onactivedata", results)
                    });
                }, 1000);
                socket.on("disconnect", () => {
                    clearInterval(interval);
                });
            });
            return;
        })

        io.on('connection', function (socket) {
            socket.on("ondatainfo", (data) => {
                if (interval) {
                    clearInterval(interval);
                }
                socket.join(data.userid);
                interval = setInterval(() => {

                    UserInfo.deviceAreaInfoDetails({ deviceid : data.deviceid, userid : data.userid }, result => {
                        
                        io.in(data.userid).emit("deviceDataInfo", result)
                    });
                }, 1000);
                socket.on("disconnect", () => {
                    clearInterval(interval);
                });

            });
            socket.on("ondataareadevice", (data) => {
            
                if (interval) {
                    clearInterval(interval);
                }
                socket.join(data.userId);
                interval = setInterval(() => {
                    UserInfo.deviceAreaBase({ areaid: data.areaid, devicestatus: data.devicestatus }, result => {
                        io.in(data.userId).emit("deviceAreaDataInfo", result)
                    });

                }, 1000);
                socket.on("disconnect", () => {
                    clearInterval(interval);
                });
            });
            socket.on("ondatahistory", (data) => {
                
                if (interval) {
                    clearInterval(interval);
                }
                socket.join(data.userId);
            
                interval = setInterval(() => {
                    UserInfo.AlertHistory({
                        userid: data.userId,
                        page: data.currentPage, limit: data.limit,
                        datewise: data.datewise
                    }, result => {
    
                        io.in(data.userId).emit("historyList", result)
                    });

                }, 1000);
                socket.on("disconnect", () => {
                    clearInterval(interval);
                });
            // return;
            });
            socket.on('ondashboard', (data) => {
            
            socket.join(data.userId);
                if (interval) {
                    clearInterval(interval);
                }
                interval = setInterval(() => {
                    UserInfo.DashboardSocket({
                        userid: data.userId
                    }, result => {
                    io.in(data.userId).emit("dashboardData", result)
                    });

                }, 1000);

                socket.on("disconnect", () => {
                    
                    clearInterval(interval);
                });
            })

        
        });
    
        let interval1 = 0;
        io.on('connection', function (socket) {
            socket.on('onrealtimedata1', function(data1){  
                
                interval1 = setInterval(() => {
                    socket.join("notify"+data1.userId);
                    UserInfo.DeviceListSocketNotification({ userid : data1.userId }, result => {
                        let results = {
                            deviceList : result,
                        };
                        io.in("notify"+data1.userId).emit("deviceData1", results);
                    });
                }, 5000);
                socket.on("disconnect", () => {
                    
                    clearInterval(interval1);
                });
            });
            return;
        });
        return router;
    }
