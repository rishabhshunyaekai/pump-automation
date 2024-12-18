import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';

import Select from 'react-select'
import { NavLink } from 'react-router-dom';
// import material ui
import {
    Row,
    Col,
    Dropdown,
    Card,
    Tooltip,
    OverlayTrigger,
    Badge
} from "react-bootstrap";
import { useParams } from "react-router";
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { DeviceDetailsService, ListAreaService } from "../../@mock-api/data/datatable"
import DeviceThermostatRoundedIcon from '@mui/icons-material/DeviceThermostatRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import {SocketIo,DEFAULT_USER } from 'config.js';
import io from 'socket.io-client';

import Pagination from "../../Pagination";
import RealTimeNotification from "../../@mock-api/data/notifications";

// Import react-circular-progressbar module and styles
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const RealTime = () => {
  let { id } = useParams();
  //SocketIo.connect(`ws://192.168.1.22:8000/users/${DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id}`)
  
  //let SocketIo=io.connect(`http://192.168.1.22:8000/users/${DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id}`);
  const [isConnected, setIsConnected] = useState(SocketIo.connected);

let myuuid = uuidv4();

  const[uuidgen]=useState(uuidv4())
  const title = 'Real Time Device Monitoring';
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
  const [state, setstate] = React.useState({
    currentPage: 1,
    limit: itemPerPage,
    areanumber: 0,
    devicestatus: 2
  });


  const { currentPage, limit, areanumber, devicestatus } = state;


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
       // console.log("wanha par")
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

  return loading ? (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-c  ontainer">
        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
          <CsLineIcons icon="chevron-left" size="13" />
          <span className="align-middle text-small ms-1">Dashboard</span>
        </NavLink>
        <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
          {title}
        </h1>
      </div>
      <Row className="mb-3">
        {/* Title End */}
        <Col md="12" lg="12" xxl="12" sm="12">
          <Row>
       
            <Col md="6" lg="6" xxl="6" sm="12" className="mb-1 text-end ">
              {/* Length Start */}
              <Select 
               
                className="react-select-container w-50 mb-1 text-end "
                classNamePrefix="react-select"
                options={listData}
                //className="btn btn-foreground-alternate"
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
            <Col md="3" lg="3" xxl="3" sm="12" className="mb-1 text-end">
              {/* Length Start */}
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
                  <Dropdown.Toggle variant="foreground-alternate" className="shadow">
                    {devicestatus == 0 ? "Active" : devicestatus == 1 ? "Inactive" : "All Items"}
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
            <Col md="3" lg="3" xxl="3" sm="12" className="mb-1 text-end">

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
                  <Dropdown.Toggle variant="foreground-alternate" className="shadow">
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
          list.length != 0 ?
            list.map((item) => {
              return (
                <Col xl="3" key={item.id}>
                  <Card className="mb-5" style={item.count_temp == 1 || item.count_moist == 1 || item.count_humi == 1 || item.fire == 1 ? { border: "2px solid red" } : { border: "none" }}>
                    <Card.Header  >
                      <Row className="g-0 align-items-center mb-0">

                        <Col className="ps-2">
                          <Row className="g-0">
                            <Col>
                              <NavLink to={`device-information/${item.deviceid}`} className="sh-5 d-flex align-items-center lh-1-25">
                                {item.devicename}
                                {/* Device Name </div> */}
                              </NavLink>
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                {item.devicestatus == 0 ? <Badge pill={true} bg="success">Active</Badge> : <Badge pill={true} bg="danger">Inactive</Badge>}
                                {/* {item.deviceid} */}

                              </div>
                            </Col>


                          </Row>

                        </Col>

                      </Row>


                    </Card.Header>
                    <Card.Body className="mb-0">
                      <Row className="g-0 align-items-center mb-2">
                        <Col xs="auto">
                          {item.count_temp == 0 ?
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <DeviceThermostatRoundedIcon className="text-primary" />  </div> :
                            <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <DeviceThermostatRoundedIcon className="text-danger" />
                            </div>
                          }
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              {item.count_temp == 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Temperature</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Temperature</div>}
                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                <div style={{ width: 45, height: 45 }}>

                                  <CircularProgressbar
                                    value={parseInt(item.temperature)}
                                    text={`${parseInt(item.temperature)}.C`}
                                    styles={buildStyles({
                                      textColor: "red",
                                      pathColor: "red",
                                      trailColor: "pink"
                                    })}
                                  />

                                </div>

                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-2">
                        <Col xs="auto">


                          {item.count_humi == 0 ?
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <OpacityOutlinedIcon className="text-primary" />
                            </div> :
                            <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <OpacityOutlinedIcon className="text-danger" />
                            </div>
                          }

                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              {/* <div className="sh-5 d-flex align-items-center lh-1-25">Humidity</div> */}
                              {item.count_humi == 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Humidity</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Humidity</div>}

                            </Col>

                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                <div style={{ width: 45, height: 45 }}>
                                  <CircularProgressbar value={parseInt(item.humidity)} text={`${parseInt(item.humidity)}%`}
                                    styles={{
                                      // Customize the text
                                      text: {
                                        // Text size
                                        fontSize: '2em !important',
                                      },

                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-2">
                        <Col xs="auto">
                          {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                        <SpeedRoundedIcon  className="text-primary" />
                      </div> */}
                          {item.count_moist == 0 ?
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <SpeedRoundedIcon className="text-primary" />
                            </div> :
                            <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <SpeedRoundedIcon className="text-danger" />
                            </div>
                          }
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              {/* <div className="sh-5 d-flex align-items-center lh-1-25">Moisture</div> */}
                              {item.count_moist == 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Moisture</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Moisture</div>}

                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">
                                <div style={{ width: 45, height: 45 }}>
                                  <CircularProgressbar value={parseInt(item.moisture)} text={`${parseInt(item.moisture)}%`}
                                    styles={{
                                      // Customize the text
                                      text: {
                                        // Text size
                                        fontSize: '2em !important',
                                      },

                                    }}
                                  />
                                </div> </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="g-0 align-items-center mb-0">
                        <Col xs="auto">
                          {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                        <LocalFireDepartmentOutlinedIcon   className="text-primary" />
                      </div> */}
                          {item.fire == 0 ?
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <LocalFireDepartmentOutlinedIcon className="text-primary" />
                            </div> :
                            <div className="border border-danger sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                              <LocalFireDepartmentOutlinedIcon className="text-danger" />
                            </div>
                          }
                        </Col>

                        <Col className="ps-3">
                          <Row className="g-0">
                            <Col>
                              {/* <div className="sh-5 d-flex align-items-center lh-1-25">Fire</div> */}
                              {item.fire == 0 ? <div className="sh-5 d-flex align-items-center lh-1-25">Fire</div> : <div style={{ color: "red" }} className="sh-5 d-flex blink align-items-center lh-1-25">Fire</div>}

                            </Col>
                            <Col xs="auto">
                              <div className="sh-5 d-flex align-items-center">{parseInt(item.fire) == 0 ? "Not Detected" : "Detected"}</div>
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
                      {/* <Row className="g-0 align-items-center mb-0">
                  

                  <Col className="ps-2">
                    <Row className="g-0">
                      <Col>
                        <div className="sh-5 d-flex align-items-center lh-1-25">Device Status</div>
                      </Col>
                      <Col xs="auto">
                        <div className="sh-5 d-flex align-items-center"> 
                        {item.devicestatus==0?"Active":"Inactive"}
                        </div>
                      </Col>
                    </Row>
                  </Col>
            </Row> */}
                    </Card.Footer>
                  </Card>
                </Col>)
            })
            :
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
    </>
  ) : <></>;
};

export default RealTime;
