    import React, { useState } from "react";
    import { NavLink } from "react-router-dom";
    // import material ui
    import HowToRegIcon from "@mui/icons-material/HowToReg";
    import LaptopIcon from "@mui/icons-material/Laptop";
    import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
    import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
    import MyLocationIcon from "@mui/icons-material/MyLocation";
    import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
    import AddCardIcon from "@mui/icons-material/AddCard";
    import BorderColorIcon from "@mui/icons-material/BorderColor";
    import { Row, Col, Button, Card,Modal,Form } from "react-bootstrap";
    import { useParams } from "react-router";
    import HtmlHead from "components/html-head/HtmlHead";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import {
    UpdateDeviceService,
    } from "../../@mock-api/data/datatable";
    import moment from "moment";
    import { SocketIo, DEFAULT_USER } from "config.js";
    import { toast } from "react-toastify";
    import { Client, Message } from 'paho-mqtt';

    const username = process.env.REACT_APP_MQTT_USERNAME;
    const password = process.env.REACT_APP_MQTT_PASSWORD;
    const hostname = process.env.REACT_APP_MQTT_HOSTNAME;
    const port     = process.env.REACT_APP_MQTT_PORT;

    const DeviceInfo = () => {
        let { id } = useParams();
        const [isConnected, setIsConnected] = useState(SocketIo.connected);
        const title = "Pump Information";
        const description = "Ecommerce Customer Detail Page";
        const [details, SetDetails] = useState(0);
        const [loading, SetLoading] = useState(false);

        const [toggleStates, setToggleStates] = useState({});
        const [show, setShow] = useState(false);
        const [currentToggleId, setCurrentToggleId] = useState(null);
        const [passwordError, setPasswordError] = useState("");
        const [pass, setPass] = useState("");
        const [toggleEnable, setToggleEnable] = useState([]);
        const [client, setClient] = useState(null);

        // For Mqtt
        React.useEffect(() => {
        // const client = new Client(  hostname,
        //                             Number(port),
        //                                 `clientId-${Math.random().toString(16).slice(2)}`
        //                             );
        const client = new Client(  `wss://mqttportal.shunyaekai.tech:443/mqtt`,
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

        React.useEffect(() => {
            SetDetails(0);
            if (isConnected) {
                SocketIo.emit("ondatainfo", { 
                    deviceid : id, 
                    userid   : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id 
                });
                SocketIo.on("deviceDataInfo", (result) => {
                    if (result) {
                        SetDetails(result);
                        SetLoading(true);
                    }
                });
            }
            return () => {
                SocketIo.off("ondatainfo");
                SocketIo.off("deviceDataInfo");
                SetDetails(0);
            };
        }, []);

        // Change Device Status
        const handleDeviceStatus = () => {
            UpdateDeviceService({
            deviceId: details.deviceid,
            status: (details.devicestatus ? '0' : '1'),
            userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id
            }, (res) => {
            if (res.data.success === true) {
                toast(res.data.message, {
                toastId: 1
                })
            }
            });
        };

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
            } else if (pass !== "345890") {
               setPasswordError("Incorrect password. Please try again.");
            } else {
              const toggleId = Object.entries(toggleStates)
                .filter(([id, isChecked]) => isChecked)
                .map(([id]) => id);
        
                const topic = `/supro/pump/${toggleId}/GEN`;
                const existingToggle = toggleEnable.find((toggle) => toggle.topic === topic);
                const payload = existingToggle?.message === "1" ? "" : "1";
          
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
                <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
                to="/"
                >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Dashboard</span>
                </NavLink>
                <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#24A6F6 ', }}>
                {title}
                </h1>
            </div>
            {/* Title End */}
            {details !== 0 && (
                <Row>
                <Col xl="4">
                    <Card className="mb-5">
                    <Card.Body className="mb-n5">
                        <div className="d-flex align-items-center flex-column mb-5">
                        <div className="mb-5 d-flex align-items-center flex-column">
                            <div className="h5 mb-1 text-uppercase" style={{color: '#24A6F6'}}><strong>{details.devicename}</strong></div>
                        </div>
                        <div
                            style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            }}
                        >
                            <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                            <div style={{ width: "98%" }}>
                                {/* <NavLink to={`/edit-device/${details.deviceid}`}> */}
                                <NavLink to={`/edit-pump/${details.deviceid}`}>
                                <Button style={{backgroundColor: "#24A6F6"}} className="w-100">
                                    Edit
                                </Button>
                                </NavLink>
                            </div>
                            </div>

                            <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                            <div style={{ width: "100%" }}>
                                {/* <Button
                                variant={
                                    details.devicestatus
                                    ? "outline-danger"
                                    : "outline-primary"
                                }
                                className="w-100"
                                // onClick={handleDeviceStatus}
                                >
                                {details.devicestatus ? "Inactive" : "Active"}
                                </Button> */}
                                <div className="d-flex align-items-center form-check form-switch justify-content-end h-100">
                                    <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault-${details.deviceid}`}
                                        style={{width: "2rem", height: "1rem", transform: "scale(1.5)", marginRight: '10px'}} 
                                        // checked={toggleStates[item.deviceid] || false} 
                                        checked={toggleStates[details.deviceid] || toggleEnable.some(toggle => toggle.topic === `/supro/pump/${details.deviceid}/GEN` && toggle.message === "1")}
                                        onChange={() => handleToggle(details.deviceid)}
                                        // checked={isChecked} onChange={handleShow}
                                    />
                                    </div>
                            </div>
                            </div>
                            {/* <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                            <div style={{ width: "100%" }}>
                                <Button
                                variant={
                                    details.devicestatus
                                    ? "outline-danger"
                                    : "outline-primary"
                                }
                                className="w-100"
                                // onClick={handleDeviceStatus}
                                >
                                {details.devicestatus ? "Inactive" : "Active"}
                                </Button>
                            </div>
                            </div> */}
                        </div>
                        </div>
                        <div className="mb-5">
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className=" sw-5 sh-5 d-flex justify-content-center align-items-center"
                                 style={{border: '1px solid #24A6F6', borderRadius: '10px', padding: '10px',backgroundColor: '#24A6F6'}}
                            >
                                <AppRegistrationIcon
                                from
                                icon="credit-card"
                                style={{color: '#fff'}}
                                />
                            </div>
                            </Col>
                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    <strong style={{fontWeight: '900', fontSize: '16px'}}>Registration Date</strong>
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {moment(details.createdat).format("ll")}
                                </div>
                                </Col>
                            </Row>
                            </Col>
                        </Row>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="sw-5 sh-5 d-flex justify-content-center align-items-center"
                                 style={{border: '1px solid #24A6F6', borderRadius: '10px', padding: '10px',backgroundColor: '#24A6F6'}}
                            >
                                <AddCardIcon icon="cart" style={{color: '#fff'}}/>
                            </div>
                            </Col>
                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    <strong style={{fontWeight: '900', fontSize: '16px'}}>Warranty Date</strong>
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {moment(details.createdat)
                                    .add(2, "year")
                                    .format("ll")}
                                </div>
                                </Col>
                            </Row>
                            </Col>
                        </Row>
                        </div>

                        <div className="mb-5">
                        <p className="text-dark mb-2"><strong style={{fontWeight: '900',fontSize: '16px'}}>Pump Details</strong></p>
                        <Row className="g-0 align-items-center mb-2">
                            {/* <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <HowToRegIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col> */}

                            {/* <Col className="ps-3"> */}
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Pump ID
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {details.deviceid}
                                </div>
                                </Col>
                            </Row>
                            {/* </Col> */}
                        </Row>

                        <Row className="g-0 align-items-center mb-2">
                            {/* <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <LaptopIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col> */}

                            {/* <Col className="ps-3"> */}
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Pump Name
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {details.devicename}
                                </div>
                                </Col>
                            </Row>
                            {/* </Col> */}
                        </Row>

                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <CompareArrowsIcon
                                from
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div> */}
                            </Col>

                            {/* <Col className="ps-3"> */}
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Area Name
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {details.AreaName}
                                </div>
                                </Col>
                            </Row>
                            {/* </Col> */}
                        </Row>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <MyLocationIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div> */}
                            </Col>

                            {/* <Col className="ps-3"> */}
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Latitude
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {" "}
                                    {details.latitude}{" "}
                                </div>
                                </Col>
                            </Row>
                            {/* </Col> */}
                        </Row>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            {/* <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <LocationSearchingIcon
                                from
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div> */}
                            </Col>

                            {/* <Col className="ps-3"> */}
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Longitude
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {" "}
                                    {details.longitude}{" "}
                                </div>
                                </Col>
                            </Row>
                            {/* </Col> */}

                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Updated At
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {" "}
                                    {moment(details.update_at).format("YYYY-MM-DD HH:mm:ss")}
                                </div>
                                </Col>
                            </Row>
                        </Row>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>

                <Col xl="8">
                    {/* Status Start */}
                    {/* <h2 className="small-title">Current Status</h2>
                    <Row className="g-2 mb-5">
                    <Col sm="6">
                        <Card className="sh-13 sh-lg-15 sh-xl-14">
                        <Card.Body className="h-100 py-3 d-flex align-items-center">
                            <Row className="g-0 align-items-center">
                            <Col xs="auto" className="pe-3">
                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons icon="tag" className="text-primary" />
                                </div>
                            </Col>
                            <Col style={{ width: "20rem" }}>
                                <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                }}
                                >
                                Temperature
                                </div>
                                <div
                                className={`${details.count_temp == 1 ? "text-danger" : "text-primary"} `}
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.3rem",
                                    paddingTop: "0.7rem",
                                }}
                                >
                                {details.temperature} &#8451;
                                </div>
                            </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className="sh-13 sh-lg-15 sh-xl-14">
                        <Card.Body className="h-100 py-3 d-flex align-items-center">
                            <Row className="g-0 align-items-center">
                            <Col xs="auto" className="pe-3">
                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons
                                    icon="clipboard"
                                    className="text-primary"
                                />
                                </div>
                            </Col>

                            <Col style={{ width: "20rem" }}>
                                <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                }}
                                >
                                Humidity
                                </div>
                                <div
                                className={`${details.count_humi == 1 ? "text-danger" : "text-primary"} `}
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.3rem",
                                    paddingTop: "0.7rem",
                                }}
                                >
                                {details.humidity} %
                                </div>
                            </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className="sh-13 sh-lg-15 sh-xl-14">
                        <Card.Body className="h-100 py-3 d-flex align-items-center">
                            <Row className="g-0 align-items-center">
                            <Col xs="auto" className="pe-3">
                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons
                                    icon="calendar"
                                    className="text-primary"
                                />
                                </div>
                            </Col>
                            <Col style={{ width: "20rem" }}>
                                <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                }}
                                >
                                Moisture
                                </div>
                                <div
                                className={`${details.count_moist == 1 ? "text-danger" : "text-primary"} `}
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.3rem",
                                    paddingTop: "0.7rem",
                                }}
                                >
                                {details.moisture} %
                                </div>
                            </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className="sh-13 sh-lg-15 sh-xl-14">
                        <Card.Body className="h-100 py-3 d-flex align-items-center">
                            <Row className="g-0 align-items-center">
                            <Col xs="auto" className="pe-3">
                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons
                                    icon="shipping"
                                    className="text-primary"
                                />
                                </div>
                            </Col>
                            <Col style={{ width: "20rem" }}>
                                <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontFamily: "sans-serif",
                                    textAlign: "center",
                                }}
                                >
                                Fire
                                </div>
                                <div
                                className={`${details.fire == 1 ? "text-danger" : "text-primary"} `}
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.3rem",
                                    paddingTop: "0.7rem",
                                }}
                                >
                                {details.fire == 1 ? "Detected" : "Not Detected"}
                                </div>
                            </Col>
                            </Row>
                        </Card.Body>
                        </Card>
                    </Col>
                    </Row> */}
                    {/* Status End */}

                    {/* Recent Orders Start */}

                    <div className="d-flex justify-content-between">
                    <h2 className="small-title" style={{color: '#24A6F6'}}><b>Recent History</b></h2>
                    {/* <NavLink to={`/alert/alert-history/${details.deviceid}`}>
                        <Button variant="primary">View More</Button>
                    </NavLink> */}
                    </div>
                    {details.historyList.length > 0 ? (
                    <>
                        <Row className="g-0  align-content-center d-flex ps-5 pe-5 mb-2 custom-sort">
                        <Col xs="3" md="3" className="pe-1 justify-content-center" >
                            <div className="text-dark text-medium cursor-pointer ">
                                <b>Pump Name</b>
                            </div>
                        </Col>
                        {/* <Col
                            lg="2"
                            className="d-flex flex-column pe-1 justify-content-center"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Temperature
                            </div>
                        </Col>
                        <Col
                            lg="2"
                            className="d-flex flex-column pe-1 justify-content-center"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Humidity
                            </div>
                        </Col>
                        <Col
                            lg="2"
                            className="d-flex flex-column pe-1 justify-content-center"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Moisture
                            </div>
                        </Col>
                        <Col
                            lg="2"
                            className="d-flex flex-column pe-1 justify-content-center"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Fire
                            </div>
                        </Col> */}
                        <Col xs="3" md="3" className="mb-lg-0 px-1">
                            <div className="text-dark text-medium cursor-pointer ">
                                <b>Updated Date</b>
                            </div>
                        </Col>
                        <Col xs="3" md="3" className="mb-lg-0 pe-3">
                            <div className="text-dark text-medium cursor-pointer ">
                                <b>Pump Status</b>
                            </div>
                        </Col>
                        <Col xs="3" md="3" className="mb-lg-0 pe-3">
                            <div className="text-dark text-medium cursor-pointer ">
                                {/* Pump Status */}
                            </div>
                        </Col>
                        </Row>

                        <Row>
                        <Col>
                            <div className="mb-5">
                            {details.historyList.map((item, index) => {
                                return (
                                <Card className="mb-2" key={index}>
                                    <Card.Body className="sh-16 sh-md-8 py-0">
                                    <Row
                                        className="g-0 h-100 align-content-center"
                                        style={{ marginLeft: "1rem" }}
                                    >
                                        <Col
                                            xs="3"
                                            md="3"
                                            className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            <span className="text-medium">
                                                {item.devicename}
                                            </span>
                                        </div>
                                        </Col>
                                        {/* <Col
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            {item.alertTemp == 1 ? (
                                            <span
                                                className="blink"
                                                style={{ color: "red" }}
                                            >
                                                {item.temperature}
                                            </span>
                                            ) : (
                                            item.temperature
                                            )}{" "}
                                            &#8451;{" "}
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            {item.alertHumi == 1 ? (
                                            <span
                                                className="blink"
                                                style={{ color: "red" }}
                                            >
                                                {item.humidity}
                                            </span>
                                            ) : (
                                            item.humidity
                                            )}
                                            %{" "}
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            {item.alertMoist == 1 ? (
                                            <span
                                                className="blink"
                                                style={{ color: "red" }}
                                            >
                                                {item.moisture}
                                            </span>
                                            ) : (
                                            item.moisture
                                            )}
                                            %{" "}
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            {item.fire == 1 ? (
                                            <span
                                                className="blink"
                                                style={{ color: "red" }}
                                            >
                                                Detected
                                            </span>
                                            ) : (
                                            <span>Not Detected</span>
                                            )}
                                        </div>
                                        </Col> */}
                                        <Col
                                            xs="3"
                                            md="3"
                                            className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100"
                                        >
                                            {moment(item.update_at).format("llll")}
                                        </Col>
                                        <Col
                                            xs="3"
                                            md="3"
                                            className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100"
                                        >
                                            0
                                        </Col>
                                        <Col
                                            xs="3"
                                            md="3"
                                            className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100"
                                        >
                                            {/* {item.devicename} */}
                                        </Col>
                                    </Row>
                                    </Card.Body>
                                </Card>
                                );
                            })}
                            </div>
                        </Col>
                        </Row>
                    </>
                    ) : (
                    <Row>
                        <Col>No Data Found</Col>
                    </Row>
                    )}
                </Col>
                </Row>
            )}

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
        ) : (
            <></>
        );
    };
    export default DeviceInfo;
