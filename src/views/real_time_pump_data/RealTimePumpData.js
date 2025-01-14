import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import Select from 'react-select'
import { NavLink } from 'react-router-dom';
import { Row,Col, Dropdown,Card,Tooltip,OverlayTrigger,Badge,Modal,Form,Button } from "react-bootstrap";
import { useParams } from "react-router";
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { DeviceDetailsService, ListAreaService } from "../../@mock-api/data/datatable"
import {SocketIo,DEFAULT_USER } from 'config.js';
import Pagination from "../../Pagination";
import "react-circular-progressbar/dist/styles.css";
import { Client, Message } from 'paho-mqtt';

const username = process.env.REACT_APP_MQTT_USERNAME;
const password = process.env.REACT_APP_MQTT_PASSWORD;
const hostname = process.env.REACT_APP_MQTT_HOSTNAME;
const port     = process.env.REACT_APP_MQTT_PORT;

const RealTimePumpData = () => {
  let { id } = useParams();
  const [isConnected, setIsConnected] = useState(SocketIo.connected);
  const[uuidgen]=useState(uuidv4())
  const title = 'Real Time Pump Monitoring';
  const description = 'Ecommerce Customer Detail Page';
  const [details, SetDetails] = useState();
  const [list, SeLists] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [listData, setListData] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [selectedItemValue, setSelectedItemValue] = React.useState(0);
  const [itemPerPage, setItemPerpage] = useState(10);
  const [totalrecord, setTotalrecoard] = useState(1);
  const [totalpage, setTotalpage] = useState(0);
  const [state, setstate] = React.useState({ currentPage: 1, limit: itemPerPage, areanumber: 0, devicestatus: 2 });
  const { currentPage, limit, areanumber, devicestatus } = state;

  const [toggleStates, setToggleStates] = useState({});
  const [show, setShow] = useState(false);
  const [currentToggleId, setCurrentToggleId] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [pass, setPass] = useState("");
  const [toggleEnable, setToggleEnable] = useState([]);
  const [client, setClient] = useState(null);

  // For Mqtt
  useEffect(() => {
    const client = new Client(  hostname,
                                Number(port),
                                 `clientId-${Math.random().toString(16).slice(2)}`
                              );
    setClient(client);
                              
    client.connect({
      userName: username,
      password: password,
      onSuccess: () => {
                          // const topic = '/supro/pump/+/GEN'
                          const topic = '/supro/pump/#'
                          client.subscribe(topic, {
                            onSuccess: ()=> console.log('Subscription Succesfull', topic),
                            onFailure: (error) => console.error('Subscription failed:', error),
                          });
                        },
      onFailure: (error) => { console.error('Connection failed:', error); },
                          });

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.error('Connection lost:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log(`Message received on topic ${message.destinationName} : ${message.payloadString}`);

      setToggleEnable((prev) => {
        const existingIndex = prev.findIndex((item) => item.topic === message.destinationName);
      
        if (existingIndex !== -1) {
          // Update the existing object if the topic matches
          return prev.map((item, index) =>
            index === existingIndex
              ? { ...item, message: message.payloadString }
              : item
          );
        } else {
          // Add a new object if the topic is not found
          return [
            ...prev,
            { topic: message.destinationName, message: message.payloadString },
          ];
        }
      });
    };

    return () => {
      if (client.isConnected()) {
          client.disconnect();
      }
    };
  }, []);

  const handlePagination = (current) => {
    setstate({ ...state, currentPage: current });
    if (isConnected) {
         SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: current, limit: limit, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen }));
    }
  };

  const Listdatanew = (filter) => {
    ListAreaService(filter, res => {
      setListData(current => [...current, { id: 0, value: "", label: "All Items", AreaNumber: "0" }]);
      setListData(current => [...current, ...res.data.result.areaList]);
    });
  }

  const singledatanew = (filter) => {
    DeviceDetailsService(filter, res => {
      if (res.data.success === true) {
        SetDetails(res.data.result);
        SetLoading(true)
      }

    });
  }

  React.useEffect(() => {
    singledatanew({ "deviceid": id, "userid": DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
    Listdatanew({ userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
  }, []);

  useEffect(() => {
    SeLists([]);
    if (isConnected) {
       SocketIo.emit('onrealtimedata',({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen  }));
        SocketIo.on('deviceData', (result) => {
          if (result.length !== 0) {
            SeLists(result.deviceList);
            setTotalrecoard(result.totalrecoard);
            setTotalpage(result.totalpage);
          } else {
            SeLists([]);
            setTotalrecoard(0);
            setTotalpage(0);
          }
        });
    }

    return () => {
      // SocketIo.off('onrealtimedata');
       SocketIo.off('deviceData');
       //SocketIo.close();
      SeLists([]);
    };
  }, [currentPage, limit]);
 
  // Add Extra Field For SELECT 2
  if (listData.length !== 0) {
    listData.map((ele) => {
      if (ele.id !== 0) {
        ele["value"] = ele.AreaName;
        ele["label"] = ele.AreaName;
      }
    });
  }

  const handleToggle = (id) => {
    setToggleStates((prevStates) => {
      const isEnabled = !prevStates[id];
      if (isEnabled) {
        setCurrentToggleId(id);
        setShow(true);
      }
      return { ...prevStates, [id]: isEnabled };
    });
  };
  
  const handleClose = () => {
    setShow(false);
    setToggleStates((prevStates) => ({
      ...prevStates,
      [currentToggleId]: false,
    }));
    setCurrentToggleId(null);
    setPasswordError("");
    setPass('')
  };

  const handleInputChange = (e) => {
    setPass(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  }
  
  const handlePasswordBlur = () => {
    if (!pass) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
  };
  
  const handleSubmit = () => {
    if (!pass) {
      setPasswordError("Password is required.");
    } else {
      const toggleId = Object.entries(toggleStates)
        .filter(([id, isChecked]) => isChecked)
        .map(([id]) => id);

        const topic = `/supro/pump/${toggleId}/GEN`;
        const existingToggle = toggleEnable.find((toggle) => toggle.topic === topic);
        const payload = existingToggle?.message === "1" ? " " : "1";
  
      client.publish(topic, payload, 0, true);
      console.log(`Message published to topic ${topic}:`,payload);

      setPasswordError("");
      setPass('')
      handleClose();
    }
  };

  return loading ? (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
          <CsLineIcons icon="chevron-left" size="13" />
          <span className="align-middle text-small ms-1">Dashboard</span>
        </NavLink>
        <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#24A6F6', }}>
          {title}
        </h1>
      </div>

      <Row className="mb-3">
        {/* Title End */}
        <Col md="12" lg="12" xxl="12" sm="12">
          <Row>
            <Col md="9" lg="8" xxl="7" sm="12" className="mb-1 text-end ">
              <Select 
                className="react-select-container w-25 mb-1 text-start "
                classNamePrefix="react-select"
                options={listData}
                onChange={(key) => {
                  setstate({ ...state, currentPage: 1, limit: itemPerPage, areanumber: key.AreaNumber, devicestatus: devicestatus });
                 if (isConnected) {
                   SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: key.AreaNumber, devicestatus: devicestatus,groupid:uuidgen  }));
                  }
                  setSelectedItem(key.AreaNumber)
                }
                }
              />
            </Col>
            <Col md="3" lg="3" xxl="4" sm="12" className="mb-1 text-end">
              <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1"
                onSelect={(key) => {
                  setstate({ ...state, currentPage: 1, limit: limit, areanumber: areanumber, devicestatus: key });
                  if (isConnected) {
                    SocketIo.io.opts.query = { userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: key,groupid:uuidgen }
                    SocketIo.disconnect().connect();
                    SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: key,groupid:uuidgen }));
                  }
                  setSelectedItemValue(key)
                }}
              >
                <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">   {devicestatus == 0 ? "Active" : devicestatus == 1 ? "Inactive" : "All Items"}</Tooltip>}>
                  <Dropdown.Toggle  className="shadow" style={{backgroundColor: '#24A6F6'}}>
                    {devicestatus === 0 ? "Active" : devicestatus === 1 ? "Inactive" : "All Items"}
                  </Dropdown.Toggle>
                </OverlayTrigger>
                <Dropdown.Menu className="shadow dropdown-menu-end">
                  <Dropdown.Item key={0} eventKey={2} value={2}>All Items</Dropdown.Item>
                  <Dropdown.Item key={1} eventKey={0} value={0}>Active</Dropdown.Item>
                  <Dropdown.Item key={2} eventKey={1} value={1}>Inactive</Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
              {/* Length End */}
            </Col>
            <Col md="1" lg="1" xxl="1" sm="12" className="mb-1 text-end">

              {/* Length Start */}
              <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1"
                onSelect={(e) => {

                  setItemPerpage(Number(e))
                  setstate({ ...state, currentPage: 1, limit: e, areanumber: areanumber, devicestatus: devicestatus });
                  // setstate({ ...state, currentPage: 1,limit:e });
                  if (isConnected) {   
                    SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: e, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen }));
                  }
                }}
              >
                <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top"> {itemPerPage} Items</Tooltip>}>
                  <Dropdown.Toggle className="shadow" style={{backgroundColor: '#24A6F6'}}>
                    {itemPerPage} Items
                  </Dropdown.Toggle>
                </OverlayTrigger>
                <Dropdown.Menu className="shadow dropdown-menu-end">
                  {[10, 20, 50].map((itemPerPage1) => (
                    <Dropdown.Item key={itemPerPage1} eventKey={itemPerPage1} value={itemPerPage1}>{itemPerPage1} Items</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* Length End */}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        {
          list.length !== 0 ?
            list.map((item) => {
              return (
                <Col xl="3" key={item.id}>
                  <Card className="mb-5" style={item.humidity === '1' ? { border: "2px solid red" } : { border: "none" }}>
                    <Card.Header  >
                      <Row className="g-0 align-items-center mb-0">
                        <Col className="ps-2">
                          <Row className="g-0">
                            <Col>
                              <NavLink to={`pump-information/${item.deviceid}`} className="sh-5 d-flex align-items-center lh-1-25" style={{color: '#24A6F6', fontWeight:'900', fontSize: '18px'}}>
                                <b>{item.devicename}</b>
                              </NavLink>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                {item.devicestatus === 1 ? <Badge pill={true} bg="success">Active</Badge> : <Badge pill={true} bg="danger">Inactive</Badge>}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Header>

                    <Card.Body className="mb-0">
                      <Row className="g-0 align-items-center mb-2">
                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">Pump Id</div>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center lh-1-25">{item.deviceid}</div> 
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-2">
                        <Col xs="auto">
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              <div className="sh-5 d-flex align-items-center lh-1-25">Pump Name</div>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center lh-1-25">{item.devicename}</div> 
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-2">
                        <Col xs="auto">
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              <div className="sh-5 d-flex align-items-center lh-1-25">Current Status</div>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center lh-1-25">{item.humidity === '1' ? 'Overflow': 'Normal'}</div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-0">
                        <Col xs="auto">
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              <div className="sh-5 d-flex align-items-center lh-1-25">Pump Capacity</div>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center lh-1-25">{item.temperature} Ltr</div> 
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>

                    <Card.Footer>
                      <Row className="g-0 align-items-center mb-0">
                        <Col className="ps-2">
                          <Row className="g-0">
                            <Col>
                              <div className="sh-5 d-flex align-items-center lh-1-25">Area</div>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                {item.AreaName}
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-0">
                        <Col className="ps-2">
                          <Row className="g-0">
                            <Col>
                              <div className="sh-5 d-flex align-items-center lh-1-25">Pump Status</div>
                            </Col>
                            <Col xs="auto">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault-${item.deviceid}`}
                                  style={{width: "2rem", height: "1rem", transform: "scale(1.5)"}} 
                                  // checked={toggleStates[item.deviceid] || false} 
                                  checked={toggleStates[item.deviceid] || toggleEnable.some(toggle => toggle.topic === `/supro/pump/${item.deviceid}/GEN` && toggle.message === "1")}
                                  onChange={() => handleToggle(item.deviceid)}
                                  // checked={isChecked} onChange={handleShow}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Footer>
                  </Card>
                </Col>)
            }) :
            <span>No Record</span>
        }
      </Row>

      <Row>
        <Col className='d-flex justify-content-center'>
          {
            totalpage > 0 ? <Pagination
              total={totalpage}
              current={currentPage}
              pagination={(crPage) => handlePagination(crPage)}
            /> : null
          }
        </Col>
      </Row>

      <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
        <Modal.Title> <h4 style={{ fontSize: '1.2rem', fontWeight: '600', position: 'relative', top: '1rem', left: '2rem' }}>Password</h4></Modal.Title>
        <Modal.Body>
          <Row className="g-3">
              <div className="">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder='Enter Password'
                  value={pass}
                  onBlur={handlePasswordBlur}
                  onChange={handleInputChange}
                />
                {passwordError && (
                  <div style={{ color: 'red', fontSize: '0.775rem', marginTop: '0.3rem',marginLeft: '0.6rem' }}>
                    {passwordError}
                  </div>
                )}
              </div>
          </Row>
        </Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '0px 1rem', marginBottom: '1rem' }}>
            <Button style={{backgroundColor: '#24A6F6'}} onClick={handleClose} >
              Cancel
            </Button>
            &nbsp;&nbsp;
            <Button style={{backgroundColor: '#24A6F6'}} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
      </Modal>
    </>
  ) : <></>;
};

export default RealTimePumpData;


// function connectionWithPumpDevice(id) {
  //   console.log("con",id);
  //   const client = new Client(  
  //                               hostname,
  //                               Number(port),
  //                               id
  //                               // `clientId-${Math.random().toString(16).slice(2)}`
  //                             );

  //                             console.log('client', client)
  //   client.connect({
  //     userName: username,
  //     password: password,
  //     onSuccess: () => {
  //                         const topic = '/supro/pump/#'
  //                         // const topic = `/supro/pump/${id}/GEN`
  //                         client.subscribe(topic, {
  //                           onSuccess: ()=> console.log('Subscription Succesfull', topic),
  //                           onFailure: (error) => console.error('Subscription failed:', error),
  //                         });
  //                       },
  //     onFailure: (error) => { console.error('Connection failed:', error); },
  //                         });

  //   client.onConnectionLost = (responseObject) => {
  //     if (responseObject.errorCode !== 0) {
  //       console.error('Connection lost:', responseObject.errorMessage);
  //     }
  //   };

  //   client.onMessageArrived = (message) => {
  //     console.log(message)
  //     console.log(`Message received on topic ${message.destinationName}: ${message.payloadString}`);
  //     setMessages((prev) => [
  //       ...prev,
  //       { topic: message.destinationName, message: message.payloadString },
  //     ]);
  //   };                         
  // }


  // if (isConnected) {
      //   const topic = `/supro/pump/${toggleId}/GEN`;
      //   const payload = JSON.stringify({
      //     toggleId,
      //     status: toggleStates[toggleId] ? "ON" : "OFF",
      //     // timestamp: new Date().toISOString(),
      //   });
    
      //   client.publish(topic, payload, 0, true); // QoS 0, retained = true
      //   console.log(`Message published to topic ${topic}:`, payload);
      // }

      // if (isConnected && currentToggleId) {
      //   const topic = `device/${currentToggleId}/data`; // Adjust topic format as needed
      //   client.subscribe(topic, {
      //     onSuccess: () => {
      //       console.log(`Subscribed to topic: ${topic}`);
      //     },
      //     onFailure: (error) => {
      //       console.error("Subscription failed:", error);
      //     },
      //   });
  
      //   // Listen for incoming messages
      //   client.onMessageArrived = (message) => {
      //     console.log(`Message received on topic ${message.destinationName}: ${message.payloadString}`);
      //     setMessages((prev) => [
      //       ...prev,
      //       { topic: message.destinationName, message: message.payloadString },
      //     ]);
      //   };
      // }



      // For Mqtt
  // useEffect(() => {
  //   const client = new Client(  hostname,
  //                               Number(port),
  //                               `id`
  //                             );
                              
  //   client.connect({
  //     userName: username,
  //     password: password,
  //     onSuccess: () => {
  //                         const topic = '/supro/pump/+/GEN'
  //                         client.subscribe(topic, {
  //                           onSuccess: ()=> console.log('Subscription Succesfull', topic),
  //                           onFailure: (error) => console.error('Subscription failed:', error),
  //                         });
  //                       },
  //     onFailure: (error) => { console.error('Connection failed:', error); },
  //                         });

  //   client.onConnectionLost = (responseObject) => {
  //     if (responseObject.errorCode !== 0) {
  //       console.error('Connection lost:', responseObject.errorMessage);
  //     }
  //   };

  //   client.onMessageArrived = (message) => {
  //     console.log(message)
  //     console.log(`Message received on topic ${message.destinationName}: ${message.payloadString}`);
  //     setMessages((prev) => [
  //       ...prev,
  //       { topic: message.destinationName, message: message.payloadString },
  //     ]);
  //   };

  //   return () => {
  //     if (client.isConnected()) {
  //         client.disconnect();
  //     }
  //   };
  // }, []);






// import React, { useState, useEffect } from 'react';
// import {v4 as uuidv4} from 'uuid';
// import Select from 'react-select'
// import { NavLink } from 'react-router-dom';
// // import material ui
// import {
//     Row,
//     Col,
//     Dropdown,
//     Card,
//     Tooltip,
//     OverlayTrigger,
//     Badge,
//     Modal,
//     Form,
//     Button
// } from "react-bootstrap";
// import { useParams } from "react-router";
// import HtmlHead from 'components/html-head/HtmlHead';
// import CsLineIcons from 'cs-line-icons/CsLineIcons';
// import { DeviceDetailsService, ListAreaService } from "../../@mock-api/data/datatable"
// import {SocketIo,DEFAULT_USER } from 'config.js';
// import Pagination from "../../Pagination";
// // import DeviceThermostatRoundedIcon from '@mui/icons-material/DeviceThermostatRounded';
// // import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
// // import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
// // import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
// // import io from 'socket.io-client';
// // import RealTimeNotification from "../../@mock-api/data/notifications";
// // Import react-circular-progressbar module and styles
// import {
//   CircularProgressbar,
//   CircularProgressbarWithChildren,
//   buildStyles
// } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// const RealTimePumpData = () => {
//   let { id } = useParams();
//   //SocketIo.connect(`ws://192.168.1.22:8000/users/${DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id}`)
//   //let SocketIo=io.connect(`http://192.168.1.22:8000/users/${DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id}`);
//   const [isConnected, setIsConnected] = useState(SocketIo.connected);

// let myuuid = uuidv4();

//   const[uuidgen]=useState(uuidv4())
//   const title = 'Real Time Pump Monitoring';
//   const description = 'Ecommerce Customer Detail Page';
//   const [details, SetDetails] = useState();
//   const [list, SeLists] = useState([]);
//   const [loading, SetLoading] = useState(false);
//   const [listData, setListData] = React.useState([]);
//   const [selectedItem, setSelectedItem] = React.useState("");
//   const [selectedItemValue, setSelectedItemValue] = React.useState(0);
//   const [itemPerPage, setItemPerpage] = useState(10);
//   const [totalrecord, setTotalrecoard] = useState(1);
//   const [totalpage, setTotalpage] = useState(0);
//   const [state, setstate] = React.useState({
//     currentPage: 1,
//     limit: itemPerPage,
//     areanumber: 0,
//     devicestatus: 2
//   });
//   // const [show, setShow] = useState(false);
//   const { currentPage, limit, areanumber, devicestatus } = state;

//   const handlePagination = (current) => {
//     setstate({ ...state, currentPage: current });
//     if (isConnected) {
//          SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: current, limit: limit, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen }));
//     }
//   };

//   const Listdatanew = (filter) => {
//     ListAreaService(filter, res => {
//       setListData(current => [...current, { id: 0, value: "", label: "All Items", AreaNumber: "0" }]);
//       setListData(current => [...current, ...res.data.result.areaList]);
//     });
//   }

//   const singledatanew = (filter) => {
//     DeviceDetailsService(filter, res => {
//       if (res.data.success === true) {
//         SetDetails(res.data.result);
//         SetLoading(true)
//       }

//     });
//   }

//   React.useEffect(() => {
//      singledatanew({ "deviceid": id, "userid": DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
//     Listdatanew({ userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
//   }, []);

//   useEffect(() => {
//     SeLists([]);
//     if (isConnected) {
//        SocketIo.emit('onrealtimedata',({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen  }));
//         SocketIo.on('deviceData', (result) => {
//         // console.log("wanha par")
//           if (result.length !== 0) {
//             SeLists(result.deviceList);
//             setTotalrecoard(result.totalrecoard);
//             setTotalpage(result.totalpage);
//           } else {
//             SeLists([]);
//             setTotalrecoard(0);
//             setTotalpage(0);
//           }
//         });
//     }

//     return () => {
//       // SocketIo.off('onrealtimedata');
//        SocketIo.off('deviceData');
//        //SocketIo.close();
//       SeLists([]);
//     };
//   }, [currentPage, limit]);
 
//   // Add Extra Field For SELECT 2
//   if (listData.length !== 0) {
//     listData.map((ele) => {
//       if (ele.id !== 0) {
//         ele["value"] = ele.AreaName;
//         ele["label"] = ele.AreaName;
//       }
//     });
//   }

//   const [show, setShow] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   const handleClose = () => {
//     setShow(false);
//     setIsChecked(false);
//   };

//   const handleShow = () => {
//     if (!isChecked) {
//       setShow(true);
//     }
//     setIsChecked(!isChecked);
//   };

//   // const handleClose = () => {
//   //   setShow(false);
//   // };
//   // const handleShow = () => {
//   //   setShow(true);
//   //   if (listData.length === 0) {
//   //     toast('Please create a area than register your devices', {
//   //       toastId: 1,
//   //     })
//   //     return
//   //   }
//   //   if (values.latitude && values.latitude) {
//   //     setCoords([]);
//   //     setReduis(0);
//   //     setShapeType();

//   //     SingleAreaService({ areanumber: areanumber, user_id: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id }, (res) => {
//   //       for (var x = 0; x < res.data.results.List.length; x++) {
//   //         setCoords((current) => [
//   //           ...current,
//   //           {
//   //             lat: parseFloat(res.data.results.List[x].lat),
//   //             lng: parseFloat(res.data.results.List[x].lng),
//   //           },
//   //         ]);
//   //       }
//   //       setReduis(res.data.results.redius);
//   //       setShapeType(res.data.results.shapetype);
//   //       setShow(true);
//   //     });
//   //   } else {
//   //     toast('Please select area name', {
//   //       toastId: 1
//   //     })
//   //   }
//   // };

//   return loading ? (
//     <>
//       <HtmlHead title={title} description={description} />
//       {/* Title Start */}
//       <div className="page-title-container">
//         <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
//           <CsLineIcons icon="chevron-left" size="13" />
//           <span className="align-middle text-small ms-1">Dashboard</span>
//         </NavLink>
//         <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#24A6F6', }}>
//           {title}
//         </h1>
//       </div>

//       <Row className="mb-3">
//         {/* Title End */}
//         <Col md="12" lg="12" xxl="12" sm="12">
//           <Row>
       
//             <Col md="9" lg="8" xxl="7" sm="12" className="mb-1 text-end ">
//               {/* Length Start */}
//               <Select 
//                 className="react-select-container w-25 mb-1 text-start "
//                 classNamePrefix="react-select"
//                 options={listData}
//                 // className="btn btn-foreground-alternate"
//                 onChange={(key) => {
//                   setstate({ ...state, currentPage: 1, limit: itemPerPage, areanumber: key.AreaNumber, devicestatus: devicestatus });
//                  if (isConnected) {
//                    SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: key.AreaNumber, devicestatus: devicestatus,groupid:uuidgen  }));
//                   }
//                   setSelectedItem(key.AreaNumber)

//                 }
//                 }
//               />
//             </Col>
//             <Col md="3" lg="3" xxl="4" sm="12" className="mb-1 text-end">
//               {/* Length Start */}
//               <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1"
//                 onSelect={(key) => {
//                   setstate({ ...state, currentPage: 1, limit: limit, areanumber: areanumber, devicestatus: key });
//                   if (isConnected) {
//                     SocketIo.io.opts.query = { userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: key,groupid:uuidgen }
//                     SocketIo.disconnect().connect();
//                     SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, areanumber: areanumber, devicestatus: key,groupid:uuidgen }));
//                   }
//                   setSelectedItemValue(key)

//                 }}
//               >
//                 <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">   {devicestatus == 0 ? "Active" : devicestatus == 1 ? "Inactive" : "All Items"}</Tooltip>}>
//                   <Dropdown.Toggle  className="shadow" style={{backgroundColor: '#24A6F6'}}>
//                     {devicestatus == 0 ? "Active" : devicestatus == 1 ? "Inactive" : "All Items"}
//                   </Dropdown.Toggle>
//                 </OverlayTrigger>
//                 <Dropdown.Menu className="shadow dropdown-menu-end">
//                   <Dropdown.Item key={0} eventKey={2} value={2}>All Items</Dropdown.Item>
//                   <Dropdown.Item key={1} eventKey={0} value={0}>Active</Dropdown.Item>
//                   <Dropdown.Item key={2} eventKey={1} value={1}>Inactive</Dropdown.Item>

//                 </Dropdown.Menu>
//               </Dropdown>
//               {/* Length End */}
//             </Col>
//             <Col md="1" lg="1" xxl="1" sm="12" className="mb-1 text-end">

//               {/* Length Start */}
//               <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1"
//                 onSelect={(e) => {

//                   setItemPerpage(Number(e))
//                   setstate({ ...state, currentPage: 1, limit: e, areanumber: areanumber, devicestatus: devicestatus });
//                   // setstate({ ...state, currentPage: 1,limit:e });
//                   if (isConnected) {   
//                     SocketIo.emit('onrealtimedata', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: e, areanumber: areanumber, devicestatus: devicestatus,groupid:uuidgen }));
//                   }
//                 }}
//               >
//                 <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top"> {itemPerPage} Items</Tooltip>}>
//                   <Dropdown.Toggle className="shadow" style={{backgroundColor: '#24A6F6'}}>
//                     {itemPerPage} Items
//                   </Dropdown.Toggle>
//                 </OverlayTrigger>
//                 <Dropdown.Menu className="shadow dropdown-menu-end">
//                   {[10, 20, 50].map((itemPerPage1) => (
//                     <Dropdown.Item key={itemPerPage1} eventKey={itemPerPage1} value={itemPerPage1}>{itemPerPage1} Items</Dropdown.Item>
//                   ))}
//                 </Dropdown.Menu>
//               </Dropdown>
//               {/* Length End */}
//             </Col>
//           </Row>
//         </Col>
//       </Row>

//       <Row>
//         {
//           list.length !== 0 ?
//             list.map((item) => {
//               return (
//                 <Col xl="3" key={item.id}>
//                   <Card className="mb-5" style={item.count_temp == 1 || item.count_moist == 1 || item.count_humi == 1 || item.fire == 1 ? { border: "2px solid red" } : { border: "none" }}>
//                     <Card.Header  >
//                       <Row className="g-0 align-items-center mb-0">
//                         <Col className="ps-2">
//                           <Row className="g-0">
//                             <Col>
//                               {/* <NavLink to={`device-information/${item.deviceid}`} className="sh-5 d-flex align-items-center lh-1-25"> */}
//                               <NavLink to={`pump-information/${item.deviceid}`} className="sh-5 d-flex align-items-center lh-1-25" style={{color: '#24A6F6', fontWeight:'900', fontSize: '18px'}}>
//                                 <b>{item.devicename}</b>
//                                 {/* Device Name </div> */}
//                               </NavLink>
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">
//                                 {item.devicestatus === 0 ? <Badge pill={true} bg="success">Active</Badge> : <Badge pill={true} bg="danger">Inactive</Badge>}
//                                 {/* {item.deviceid} */}
//                               </div>
//                             </Col>
//                           </Row>
//                         </Col>
//                       </Row>
//                     </Card.Header>

//                     <Card.Body className="mb-0">
//                       <Row className="g-0 align-items-center mb-2">
//                         {/* <Col xs="auto">
//                           {item.count_temp == 0 ?
//                             <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <DeviceThermostatRoundedIcon className="text-primary" />  </div> :
//                             <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <DeviceThermostatRoundedIcon className="text-danger" />
//                             </div>
//                           }
//                         </Col> */}

//                         <Col className="ps-3">
//                           <Row className="g-0">
//                             <Col>
//                                 <div className="sh-5 d-flex align-items-center lh-1-25">Pump Id</div>
//                               {/* {item.count_temp === 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Pump Id</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Temperature</div>} */}
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center lh-1-25"></div> 
//                             </Col>
//                             {/* <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">
//                                 <div style={{ width: 45, height: 45 }}>
//                                   <CircularProgressbar
//                                     value={parseInt(item.temperature)}
//                                     text={`${parseInt(item.temperature)}.C`}
//                                     styles={buildStyles({
//                                       textColor: "red",
//                                       pathColor: "red",
//                                       trailColor: "pink"
//                                     })}
//                                   />
//                                 </div>
//                               </div>
//                             </Col> */}
//                           </Row>
//                         </Col>
//                       </Row>
//                       <Row className="g-0 align-items-center mb-2">
//                         <Col xs="auto">
//                           {/* {item.count_humi == 0 ?
//                             <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <OpacityOutlinedIcon className="text-primary" />
//                             </div> :
//                             <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <OpacityOutlinedIcon className="text-danger" />
//                             </div>
//                           } */}
//                         </Col>

//                         <Col className="ps-3">
//                           <Row className="g-0">
//                             <Col>
//                               <div className="sh-5 d-flex align-items-center lh-1-25">Pump Name</div>
//                               {/* {item.count_humi === 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Pump Name</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Humidity</div>} */}
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center lh-1-25"></div> 
//                             </Col>

//                             {/* <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">
//                                 <div style={{ width: 45, height: 45 }}>
//                                   <CircularProgressbar value={parseInt(item.humidity)} text={`${parseInt(item.humidity)}%`}
//                                     styles={{
//                                       // Customize the text
//                                       text: {
//                                         // Text size
//                                         fontSize: '2em !important',
//                                       },

//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                             </Col> */}
//                           </Row>
//                         </Col>
//                       </Row>
//                       <Row className="g-0 align-items-center mb-2">
//                         <Col xs="auto">
//                           {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                         <SpeedRoundedIcon  className="text-primary" />
//                       </div> */}
//                           {/* {item.count_moist == 0 ?
//                             <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <SpeedRoundedIcon className="text-primary" />
//                             </div> :
//                             <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <SpeedRoundedIcon className="text-danger" />
//                             </div>
//                           } */}
//                         </Col>

//                         <Col className="ps-3">
//                           <Row className="g-0">
//                             <Col>
//                               <div className="sh-5 d-flex align-items-center lh-1-25">Current Status</div>
//                               {/* {item.count_moist === 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Current Status</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Moisture</div>} */}
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center lh-1-25"></div> 
//                             </Col>
//                             {/* <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">
//                                 <div style={{ width: 45, height: 45 }}>
//                                   <CircularProgressbar value={parseInt(item.moisture)} text={`${parseInt(item.moisture)}%`}
//                                     styles={{
//                                       text: {
//                                         fontSize: '2em !important',
//                                       },

//                                     }}
//                                   />
//                                 </div> </div>
//                             </Col> */}
//                           </Row>
//                         </Col>
//                       </Row>
//                       <Row className="g-0 align-items-center mb-0">
//                         <Col xs="auto">
//                           {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                         <LocalFireDepartmentOutlinedIcon   className="text-primary" />
//                       </div> */}
//                           {/* {item.fire == 0 ?
//                             <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <LocalFireDepartmentOutlinedIcon className="text-primary" />
//                             </div> :
//                             <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
//                               <LocalFireDepartmentOutlinedIcon className="text-danger" />
//                             </div>
//                           } */}
//                         </Col>

//                         <Col className="ps-3">
//                           <Row className="g-0">
//                             <Col>
//                               <div className="sh-5 d-flex align-items-center lh-1-25">Pump Capacity</div>
//                               {/* {item.fire == 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Pump Capacity</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Fire</div>} */}
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center lh-1-25"></div> 
//                             </Col>
//                             {/* <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">{parseInt(item.fire) == 0 ? "Not Detected" : "Detected"}</div>
//                             </Col> */}
//                           </Row>
//                         </Col>
//                       </Row>
//                     </Card.Body>

//                     <Card.Footer>
//                       <Row className="g-0 align-items-center mb-0">
//                         <Col className="ps-2">
//                           <Row className="g-0">
//                             <Col>
//                               <div className="sh-5 d-flex align-items-center lh-1-25">Area</div>
//                             </Col>
//                             <Col xs="auto">
//                               <div className="sh-5 d-flex align-items-center">
//                                 {item.AreaName}
//                               </div>
//                             </Col>
//                           </Row>
//                         </Col>
//                       </Row>
//                       <Row className="g-0 align-items-center mb-0">
//                         <Col className="ps-2">
//                           <Row className="g-0">
//                             <Col>
//                               <div className="sh-5 d-flex align-items-center lh-1-25">Pump Status</div>
//                             </Col>
//                             <Col xs="auto">
//                               {/* <div className="sh-5 d-flex align-items-center"> 
//                               {item.devicestatus==0?"Active":"Inactive"}
//                               </div> */}
//                               <div class="form-check form-switch">
//                                 <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
//                                       style={{width: "2rem", height: "1rem", transform: "scale(1.5)"}}  checked={isChecked}
//                                       onChange={handleShow}/>
//                                 {/* <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label> */}
//                               </div>
//                             </Col>
//                           </Row>
//                         </Col>
//                       </Row>
//                       {/* <Row className="g-0 align-items-center mb-0">
                  

//                   <Col className="ps-2">
//                     <Row className="g-0">
//                       <Col>
//                         <div className="sh-5 d-flex align-items-center lh-1-25">Device Status</div>
//                       </Col>
//                       <Col xs="auto">
//                         <div className="sh-5 d-flex align-items-center"> 
//                         {item.devicestatus==0?"Active":"Inactive"}
//                         </div>
//                       </Col>
//                     </Row>
//                     </Col>
//                    </Row> */}
//                     </Card.Footer>
//                   </Card>
//                 </Col>)
//             }) :
//             <span>No Record</span>
//         }
//       </Row>

//       <Row>
//         <Col className='d-flex justify-content-center'>
//           {
//             totalpage > 0 ? <Pagination
//               total={totalpage}
//               current={currentPage}
//               pagination={(crPage) => handlePagination(crPage)}
//             /> : null
//           }
//         </Col>
//       </Row>

//        <Modal show={show} size="lg" onHide={handleClose}>
//         <Modal.Header>
//         <h2>Password</h2>
//       </Modal.Header>
//       <Modal.Body>
//         <Row className="g-3 pt-5 pb-5">
//             <Col lg="8" className="mx-auto">
//               <Form.Label>Enter Password</Form.Label>
//               <div className="">
//                 <Form.Control
//                   type="password"
//                   name="password"
//                   autocomplete="off"
//                 />
//               </div>
//             </Col>
//           </Row>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button style={{backgroundColor: '#24A6F6'}} onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button style={{backgroundColor: '#24A6F6'}}>
//           Submit
//         </Button>
//       </Modal.Footer>
//     </Modal> 
//     </>
//   ) : <></>;
// };

// export default RealTimePumpData;
