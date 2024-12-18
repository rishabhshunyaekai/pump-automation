import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import { SocketIo, DEFAULT_USER } from 'config.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DeviceCloseNotificationServices } from '@mock-api/data/datatable';
let user_id = sessionStorage.getItem("user_id")
const RealTimeNotification = ({ children }) => {
  useLayout();
  const [isConnected, setIsConnected] = React.useState(SocketIo.connected);
  const [audio_path, setAudioPath] = React.useState('/sound.mp3');

  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    if (isConnected) {
      SocketIo.emit('onrealtimedata1', ({
        userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
        currentPage: 1, limit: 1000, areanumber: 0,
        devicestatus: 2
      }));

      SocketIo.on('deviceData1', (result) => {
        if (result.deviceList.length > 0) {
          for (let x = 0; x < result.deviceList.length; x++) {
            if (result.deviceList[x].count_temp == 1) {
              toast(`Temperature Alert from ${result.deviceList[x].deviceid}`, {
                toastId: `t1-${result.deviceList[x].deviceid}`
              })
            }
            if (result.deviceList[x].count_humi == 1) {
              toast(`Humidity Alert from ${result.deviceList[x].deviceid}`, {
                toastId: "h1"
              })
            }
            if (result.deviceList[x].count_moist == 1) {
              toast(`Moisture Alert from ${result.deviceList[x].deviceid}`, {
                toastId: "m1"
              })
            }
            if (result.deviceList[x].fire == 1) {
              toast(`Fire Alert from ${result.deviceList[x].deviceid}`, {
                toastId: "f1"
              })
            }
          }
        }
      });
    }
    return () => {
      SocketIo.off('onrealtimedata1');
      SocketIo.off('deviceData1');
    };
  }, [pathname]);

  return (
    <>
    </>
  );
};

export default React.memo(RealTimeNotification);


// onClick: () => {
//   const filter = {
//     deviceid: deviceid
//     , datatype: datatype
//   }
//   DeviceCloseNotificationServices(filter, res => {
//     filter = {
//       deviceid: ""
//       , datatype: ""
//     }
//   })
// },
//   onClose: (e) => {
//     DeviceCloseNotificationServices({ deviceid: deviceid, datatype: datatype }, res => {
//     })
//   },