    import React, { useState } from "react";
    import { Link, NavLink, useParams } from "react-router-dom";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
    import PhonelinkEraseOutlinedIcon from "@mui/icons-material/PhonelinkEraseOutlined";
    import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
    import VibrationOutlinedIcon from "@mui/icons-material/VibrationOutlined";
    import { Row, Col, Card } from "react-bootstrap";
    import { GoogleMap, Data, DrawingManager, useJsApiLoader, Circle, Polygon, Marker, } from "@react-google-maps/api";
    import DeviceList from "views/device_list/DeviceList";
    import DeviceAreaList from "views/area_device_list/AreaDeviceList";
    import { DeviceAreaListService, SingleAreaService, } from "@mock-api/data/datatable";

    import { SocketIo, DEFAULT_USER } from "config.js";
    const containerStyle = { width: "100wv", height: "600px", };
    const center         = { lat: 28.805918377354473, lng: 76.93546814405957, };
    let user_id          = sessionStorage.getItem("user_id")
    let lib              = ["places", "geometry", "visualization", "drawing"];
    const google         = (window.google = window.google ? window.google : {});
    const ViewMap = () => {
        let { id }                          = useParams();
        const [isConnected, setIsConnected] = useState(SocketIo.connected);
        const title                         = "View Map";
        const { isLoaded } = useJsApiLoader({
            id               : "google-map-script",
            googleMapsApiKey : "AIzaSyDvqub0gVMyj_O-pMmLRkQQKP_UsCMKFXQ",
            libraries        : lib,
        });
        const [coords, setCoords]           = React.useState([]);
        const [deviceData, setDeviceData]   = React.useState([]);
        const [redius, setReduis]           = React.useState(0);
        const [shapetype, setShapeType]     = React.useState();
        const [totalActive, setTotalActive] = React.useState(0)
        const [totalDevice, setTotalDevice] = React.useState(0)

        let areanumber = window.location.pathname.split("/").pop();

        React.useEffect(() => {
            console.log('areanumber', areanumber)
            setDeviceData([]);
            SingleAreaService({ areanumber: areanumber, userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id }, (res) => {
                for (var x = 0; x < res.data.results.List.length; x++) {
                    setCoords((current) => [
                        ...current,
                        {
                            lat : parseFloat(res.data.results.List[x].lat),
                            lng : parseFloat(res.data.results.List[x].lng),
                        },
                    ]);
                }
                setReduis(res.data.results.redius);
                setShapeType(res.data.results.shapetype);
                if (isConnected) {
                    SocketIo.emit("ondataareadevice", { userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, areaid: areanumber, devicestatus: "all" });

                    SocketIo.on("deviceAreaDataInfo", (result) => {
                        setDeviceData(result.data);
                        setTotalDevice(result.deviceCount[0].totalDevice)
                        setTotalActive(result.deviceCount[0].totalActive)
                    });
                }
                return () => {
                    SocketIo.off("ondataareadevice");
                    SocketIo.off("deviceAreaDataInfo");
                    setDeviceData([]);
                    setTotalActive(0)
                    setTotalDevice(0)
                };
            });
        }, []);
        const [map, setMap] = React.useState(null);
        const onLoad        = React.useCallback(function callback(map) {
            setMap(map);
        }, []);
        const onUnmount = React.useCallback(function callback(map) {
            setMap(null);
        }, []);

        return isLoaded ? (
            <>
                <div className="page-title-container">
                    <Row className="g-0">
                        {/* Title Start */}
                        <Col className="col-auto mb-3 mb-sm-0 me-auto">
                            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/area_list" >
                                <CsLineIcons icon="chevron-left" size="13" />
                                <span className="align-middle text-small ms-1">Aear List</span>
                            </NavLink>
                            <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: "0.5rem", fontWeight: "700", fontSize: "1.5rem", color: "#5ebce3", }} > {title} </h1>
                        </Col>
                        {/* Title End */}
                    </Row>
                </div>
                <Row>
                    <Col xl="6 mt-5">
                        <div>
                            <GoogleMap mapContainerStyle={containerStyle} center={coords[0]} zoom={7} onLoad={onLoad} onUnmount={onUnmount} mapTypeId="terrain" >
                                {deviceData.map((data, index) => (
                                    <Marker
                                        key={index}
                                        position={{
                                            lat: parseFloat(data.latitude),
                                            lng: parseFloat(data.longitude),
                                        }}
                                        // icon={
                                        //     url= "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                        // }
                                        draggable={true}
                                        // onDragEnd={onPositionChanged}
                                        zIndex={2}
                                    />
                                ))}
                                {deviceData.length > 0 ? (
                                    deviceData.map((data, index) => (
                                    <Marker
                                        key={index}
                                        position={data}
                                        draggable={false}
                                        // onDragEnd={onPositionChanged}
                                        zIndex={2}
                                    />
                                    ))
                                ) : (
                                    <Marker
                                    key={0}
                                    // position={coords[0]}
                                    draggable={false}
                                    // onDragEnd={onPositionChanged}
                                    zIndex={2}
                                    />
                                )}
                                {shapetype == "circle" ? (
                                    <Circle
                                    center={coords[0]}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: "#FF0000",
                                        fillOpacity: 0.35,
                                        clickable: false,
                                        draggable: false,
                                        editable: false,
                                        visible: true,
                                        radius: parseFloat(redius),
                                        zIndex: 1,
                                    }}
                                    draggable={true}
                                    />
                                ) : (
                                    <Polygon
                                    paths={coords}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: "#FF0000",
                                        fillOpacity: 0.35,
                                        clickable: false,
                                        draggable: false,
                                        editable: false,
                                        visible: true,
                                        zIndex: 1,
                                    }}
                                    />
                                )}
                            </GoogleMap>
                        </div>
                    </Col>

                    <Col xl="6 mt-5">
                    {/* Status Start */}
                    <Row className="g-2 mb-5">
                        <Col sm="4">
                        <Card className="h-100 hover-scale-up cursor-pointer" onClick={
                            () => {

                            if (isConnected == true) {
                                SocketIo.emit("ondataareadevice", { userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, areaid: areanumber, devicestatus: 'all' });
                                SocketIo.on("deviceAreaDataInfo", (result) => {
                                setDeviceData(result.data);
                                });

                            }
                            }
                        }>
                            <Card.Body className="d-flex flex-column align-items-center">
                            <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                                <DesktopWindowsOutlinedIcon className="text-primary" />
                            </div>
                            <div
                                className="mb-1 d-flex align-items-center text-alternate lh-1-25"
                                style={{ fontSize: "0.8rem" }}
                            >
                                TOTAL DEVICES
                            </div>
                            <div
                                className="text-primary cta-4"
                                style={{ fontSize: "1.3rem" }}
                            >
                                {totalDevice}
                            </div>
                            </Card.Body>
                        </Card>
                        </Col>

                        <Col sm="4">
                        <Card className="h-100 hover-scale-up cursor-pointer"
                            onClick={
                            () => {

                                if (isConnected == true) {
                                SocketIo.emit("ondataareadevice", {  userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,areaid: areanumber, devicestatus: 0 });
                                SocketIo.on("deviceAreaDataInfo", (result) => {
                                    //   alert(isConnected);
                                    setDeviceData(result.data);
                                });

                                }
                            }
                            }>
                            <Card.Body className="d-flex flex-column align-items-center">
                            <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                                <VibrationOutlinedIcon className="text-primary" />
                            </div>
                            <div
                                className="mb-1 d-flex align-items-center text-alternate lh-1-25"
                                style={{ fontSize: "0.8rem" }}

                            >
                                ACTIVE DEVICES
                            </div>
                            <div
                                className="text-primary cta-4"
                                style={{ fontSize: "1.3rem" }}
                            >
                                {totalActive}
                            </div>
                            </Card.Body>
                        </Card>
                        </Col>

                        <Col sm="4">
                        <Card className="h-100 hover-scale-up cursor-pointer" onClick={
                            () => {

                            if (isConnected == true) {
                                SocketIo.emit("ondataareadevice", {  userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,areaid: areanumber, devicestatus: 1 });
                                SocketIo.on("deviceAreaDataInfo", (result) => {
                                //   alert(isConnected);
                                setDeviceData(result.data);
                                });

                            }
                            }
                        }>
                            <Card.Body className="d-flex flex-column align-items-center">
                            <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                                <PhonelinkEraseOutlinedIcon className="text-primary" />
                            </div>
                            <div
                                className="mb-1 d-flex align-items-center text-alternate lh-1-25"
                                style={{ fontSize: "0.8rem" }}
                            >
                                INACTIVE DEVICES
                            </div>
                            <div
                                className="text-primary cta-4"
                                style={{ fontSize: "1.3rem" }}
                            >
                                {totalDevice - totalActive}
                            </div>
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                    {deviceData.length !== 0 && <DeviceAreaList data={deviceData} />}
                    </Col>
                </Row >
                </>
            ) : (
            <></>
        );
};

export default ViewMap;
