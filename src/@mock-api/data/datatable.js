
    import { SERVICE_URL } from 'config';
    import axios from 'axios';
    axios.defaults.baseURL = SERVICE_URL;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    const LoginService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/login`, requestData);
            return callback(response.data);
        } catch (error) {
            return callback(error);;
            // console.error(error);
        }
    }
    const AddDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/add-device`, requestData);
            return callback(response.data);
        } catch (error) {
            return callback(error);;
            // console.error(error);
        }
    }
    const AddAreaService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/addArea`, requestData, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
            });
            return callback(response.data);
        } catch (error) {
            return callback(error);;
            // console.error(error);
        }
    }
    const ListAreaService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/areaList`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const SingleAreaService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/areaSingle`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const SingleDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/deviceareaList`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const ListDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/deviceList`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const DeleteDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/devicedelete`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const UpdateDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/deviceupdate`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const ReassignDeviceService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/reassigndevice`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const DeviceDetailsService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/devicedetails`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const DeviceAreaListService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/areaSingleName`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const DeviceAlertHistoryListService = async (requestData, callback) => {
        try {
            const response = await axios.post(`/devicealertList`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const SingleDeviceDataService = async (requestData, callback) => {
            try {
                const response = await axios.post(`/sigleDevice`, requestData);
                return callback(response);
            } catch (error) {
                throw error;
                // console.error(error);
            }
    }
    const SetDeviceParameterService = async (requestData, callback) => {
        try {
            
            const response = await axios.post(`/deviceparameter`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const AddComment = async (requestData, callback) => {
        try {
            const response = await axios.post(`/comment_device`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const Commentlist = async (requestData, callback) => {
        try {
            const response = await axios.post(`/commentlist`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    const DeviceNotificationCloseServices = async (requestData, callback) => {
        try {
            const response = await axios.post(`/closeNotify`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    }
    // Code created by Ravv
    // Member Module function 
    const AddMember = async (requestData, callback) => {
        try {
            const response = await axios({
                method  : "POST",
                url     : "/add-member",
                data    : requestData,
                headers : {
                  "Content-Type": "multipart/form-data"
                }
            });
            return callback(response.data);
        } catch (error) {
            return callback(error);;
        }
    }
    const ListMember = async (requestData, callback) => {
        try {
            const response = await axios.post(`/memberList`, requestData);
            return callback(response);
        } catch (error) {
            throw error;
            // console.error(error);
        }
    } 
    
    const EditMember = async (requestData, callback) => {
        try {
            
            const response = await axios({
                method  : "POST",
                url     : "/edit-member",
                data    : requestData,
                headers : {
                  "Content-Type": "multipart/form-data"
                }
            });
            return callback(response.data);
        } catch (error) {
            return callback(error);;
        }
    }
     
    const postRequest = async (URL, requestData, callback) => {
        try {
            const response = await axios.post(URL, requestData);
            return callback(response.data);
        } catch (error) {
            throw error;
        }
    } 

    const sendWhstpMsg = async (mobile, message, callback) => {
        const msgObj =  {
            "messaging_product" : "whatsapp",
            "to"                : [ mobile ],
            "type"              : "template",
            "template" : {
                "name"       : "currentfinal",
                "language"   : { "code" : "en" },
                "components" : [
                    {
                        "type"       : "body",
                        "parameters" : [
                            {
                                "type" : "text",
                                "text" : message
                            },{
                                "type" : "text",
                                "text" : 25
                            }
                        ]
                    }
                ]
            }
        }
        try {
            await axios({
                method  : "POST",
                url     : "https://graph.facebook.com/v15.0/103881062566365/messages",
                data    : msgObj,
                headers : {
                    "Authorization": "Bearer EABV8TM5UawMBAKR235i6VX4L15hS1cFsZAGgfYbKziEI9O6PYZCOXIWY8ZCvskm2VIfhTHuUOrCbfJ88VaarneJ7xXIRN3M3DkoeBhu6lU3tak4sYMul8SUWAZCrZCe2pPZCiRHefDSUqycbbd3dRxFgFIDGgG3pAdCfjZBFZB317xzQxInkBmIi"
                }
            });
            //return callback(100, null);  //response.messages
        } catch (error) {
            console.log('error', error); 
            //return callback(error);
        }
    } 
    export {
        LoginService, AddDeviceService, AddAreaService,
        ListAreaService, SingleAreaService, SingleDeviceService,
        ListDeviceService, DeleteDeviceService, ReassignDeviceService, DeviceDetailsService, DeviceAreaListService,
        UpdateDeviceService, DeviceAlertHistoryListService, SingleDeviceDataService,
        SetDeviceParameterService, AddComment, Commentlist, DeviceNotificationCloseServices, AddMember, EditMember, postRequest, sendWhstpMsg
    }
