    import React, { useEffect } from 'react';
    import { DEFAULT_USER } from 'config.js';
    import io from 'socket.io-client';
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { DeviceNotificationCloseServices } from '@mock-api/data/datatable';
    const SocketIo = io('https://env.shunyaekai.com/');
    //const SocketIo = io('http://localhost:8080');  // set PORT=3030 && 
    const RealTimeNotification = ()=> {
        
        let newconnected                    = SocketIo.connected;
        const [isConnected, setIsConnected] = React.useState(SocketIo.connected);
        const [filterdata, setFilter]       = React.useState({deviceid:"",datatype:""});
        const [audio_path, setAudioPath]    = React.useState('/sound.mp3');

        useEffect(() => {
        
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            //  if (newconnected) {
            SocketIo.emit('onrealtimedata1', ({ 
                userId : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id
            }));
            SocketIo.on('deviceData1', (result) => {

                if (result.deviceList.length > 0) {
                    //console.log('Socket', result.deviceList);
                    for (let x = 0; x < result.deviceList.length; x++) {
                        
                        if (result.deviceList[x].notify_temp == 1) {
                            alert_notification("Temperature Alert", result.deviceList[x].id + "0", result.deviceList[x].deviceid, "Temperature Alert from " + result.deviceList[x].devicename, "temp")
                        }
                        if (result.deviceList[x].notify_humi == 1) {
                            alert_notification("Humidity Alert", result.deviceList[x].id + "00", result.deviceList[x].deviceid, "Humidity Alert from " + result.deviceList[x].devicename, "humi")
                        }
                        if (result.deviceList[x].notify_moist == 1) {
                            alert_notification("Moisture Alert", result.deviceList[x].id + "000", result.deviceList[x].deviceid, "Moisture Alert from " + result.deviceList[x].devicename, "moist")
                        }
                        if (result.deviceList[x].notify_fire == 1) {
                            alert_notification("Fire Alert", result.deviceList[x].id + "0000", result.deviceList[x].deviceid, "Fire Alert from " + result.deviceList[x].devicename, "fire")
                        }
                    }
                }
            });
            return () => {
                SocketIo.off('deviceData1');
            };
        }, []);
        function playAudio() {
            var audio = new Audio(audio_path);
            // console.log(audio.paused)
            // if(audio.paused === true){
            //   audio.play();
            //   audio.pause();
            // }else{
            //   audio.pause();
            //   audio.currentTime = 0;
            //   audio.play();
            // }
            audio.play();
        }
        function alert_notification(title, id, deviceid, body_text, datatype) {
            playAudio();
            toastalert(body_text, id, deviceid, datatype);
            var notification = new Notification(title, {
                body: body_text,
            });
            notification.close();
        }
        const filter = {
            deviceid : "",
            datatype : ""
        }
        const toastalert = ( bodytxt, id, deviceid, datatype ) => {
            toast(bodytxt, {
                position        : "top-right",
                toastId         : id,
                autoClose       : 3000,
                hideProgressBar : true,
                closeOnClick    : false,
                pauseOnHover    : false,
                draggable       : false,
                progress        : undefined,
                onClick         : () => {
                    filterdata.datatype = datatype;
                    filterdata.deviceid = deviceid;
                    DeviceNotificationCloseServices(filterdata,data=>{
                        console.log(data)
                    })
                },
                theme : "light",
            });
        }
        return(<><ToastContainer /></>)
    }
    export default RealTimeNotification;
