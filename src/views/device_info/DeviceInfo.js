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
    import { Row, Col, Button, Card } from "react-bootstrap";
    import { useParams } from "react-router";
    import HtmlHead from "components/html-head/HtmlHead";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import {
    UpdateDeviceService,
    } from "../../@mock-api/data/datatable";
    import moment from "moment";
    import { SocketIo, DEFAULT_USER } from "config.js";
    import { toast } from "react-toastify";

    const DeviceInfo = () => {
        let { id } = useParams();
        const [isConnected, setIsConnected] = useState(SocketIo.connected);
        const title = "Device Information";
        const description = "Ecommerce Customer Detail Page";
        const [details, SetDetails] = useState(0);
        const [loading, SetLoading] = useState(false);

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
                <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
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
                            <div className="h5 mb-1">{details.devicename}</div>
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
                            <div style={{ width: "95%" }}>
                                <NavLink to={`/edit-device/${details.deviceid}`}>
                                <Button variant="primary" className="w-100 me-2">
                                    Edit
                                </Button>
                                </NavLink>
                            </div>
                            </div>

                            <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                            <div style={{ width: "95%" }}>
                                <Button
                                variant={
                                    details.devicestatus
                                    ? "outline-danger"
                                    : "outline-primary"
                                }
                                className="w-100 me-2"
                                // onClick={handleDeviceStatus}
                                >
                                {details.devicestatus ? "Inactive" : "Active"}
                                </Button>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="mb-5">
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <AppRegistrationIcon
                                from
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>
                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Registration Date
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
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <AddCardIcon icon="cart" className="text-primary" />
                            </div>
                            </Col>
                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Warranty Date
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
                        <p className="text-small text-muted mb-2">Device Details</p>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <HowToRegIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>

                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Device ID
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {details.deviceid}
                                </div>
                                </Col>
                            </Row>
                            </Col>
                        </Row>

                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <LaptopIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>

                            <Col className="ps-3">
                            <Row className="g-0">
                                <Col>
                                <div className="sh-5 d-flex align-items-center lh-1-25">
                                    Device Name
                                </div>
                                </Col>
                                <Col xs="auto">
                                <div className="sh-5 d-flex align-items-center">
                                    {details.devicename}
                                </div>
                                </Col>
                            </Row>
                            </Col>
                        </Row>

                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <CompareArrowsIcon
                                from
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>

                            <Col className="ps-3">
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
                            </Col>
                        </Row>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <MyLocationIcon
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>

                            <Col className="ps-3">
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
                            </Col>
                        </Row>
                        <Row className="g-0 align-items-center mb-2">
                            <Col xs="auto">
                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                <LocationSearchingIcon
                                from
                                icon="credit-card"
                                className="text-primary"
                                />
                            </div>
                            </Col>

                            <Col className="ps-3">
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
                            </Col>
                        </Row>
                        </div>
                    </Card.Body>
                    </Card>
                </Col>

                <Col xl="8">
                    {/* Status Start */}
                    <h2 className="small-title">Current Status</h2>
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
                    </Row>
                    {/* Status End */}

                    {/* Recent Orders Start */}

                    <div className="d-flex justify-content-between">
                    <h2 className="small-title">Recent History</h2>
                    {/* <NavLink to={`/alert/alert-history/${details.deviceid}`}>
                        <Button variant="primary">View More</Button>
                    </NavLink> */}
                    </div>
                    {details.historyList.length > 0 ? (
                    <>
                        <Row className="g-0  align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
                        <Col
                            lg="2"
                            className="d-flex flex-column pe-1 justify-content-center"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Device Name
                            </div>
                        </Col>
                        <Col
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
                        </Col>
                        <Col
                            lg="2"
                            className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                        >
                            <div className="text-muted text-medium cursor-pointer ">
                            Updated Date
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
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0"
                                        >
                                        <div className="text-alternate">
                                            <span className="text-medium">
                                            {item.devicename}
                                            </span>
                                        </div>
                                        </Col>
                                        <Col
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
                                        </Col>
                                        <Col
                                        xs="6"
                                        md="2"
                                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100"
                                        >
                                        {moment(item.update_at).format("llll")}
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
            </>
        ) : (
            <></>
        );
    };
    export default DeviceInfo;
