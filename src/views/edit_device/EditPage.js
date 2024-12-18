    import React, { useEffect, useState } from "react";
    import moment from "moment";
    import { NavLink, useLocation, useParams, } from "react-router-dom";
    
    import Select from "react-select";
    import { Row, Col, Button, Form, Card, Modal, Dropdown, Tooltip, OverlayTrigger, } from "react-bootstrap";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import { ListAreaService, SingleAreaService } from "@mock-api/data/datatable";
    import { UpdateDeviceService, SingleDeviceDataService, } from "@mock-api/data/datatable";
    import { DEFAULT_USER } from "config";
    import { GoogleMap, Data, DrawingManager, useJsApiLoader, Circle, Polygon, Marker, } from "@react-google-maps/api";
    import { toast } from "react-toastify";
    const containerStyle = {
        width  : "100wv",
        height : "600px",
    };
    const center = {
        lat : 28.6139,
        lng : 77.209,
    };
    let lib      = ["places", "geometry", "visualization", "drawing"];
    const google = (window.google = window.google ? window.google : {});

    const EditPage = () => {
        let { id } = useParams();
        // Popup Code start from here
        const [show, setShow] = useState(false);
        const handleClose     = () => setShow(false);
        const handleShow = (e) => {
            setCoords([]);
            setReduis(0);
            setShapeType();
            SingleAreaService({ 
                areanumber : deviceData.areaid, 
                user_id    : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id 
            }, (res) => {
                for (var x = 0; x < res.data.results.List.length; x++) {
                    setCoords((current) => [
                        ...current,
                        {
                            lat : parseFloat( res.data.results.List[x].lat ),
                            lng : parseFloat( res.data.results.List[x].lng ),
                        },
                    ]);
                }
                setReduis(res.data.results.redius);
                setShapeType(res.data.results.shapetype);
                setShow(true);
            });
        };
        // Popup Code End from here
        const [deviceId, setDeviceID]     = useState();
        const [deviceName, setDeviceName] = useState();
        const [areaName, setareaName]     = useState();
        const [areanumber, setAreaNumber] = React.useState();
        const [regisdate, setRegisDate]   = useState();
        const [latitude, setLatitude]     = useState();
        const [longitude, setLongitude]   = useState();
        const [deviceData, setDeviceData] = useState({
            deviceid   : "",
            userid     : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
            devicename : "",
            areaid     : "",
            latitude,
            longitude
        });

        const [error, setError] = useState(false);
        const [reset, setreset] = useState("");

        React.useEffect(() => {
            SingleDeviceDataService(
                {
                    deviceid : id,
                    userid   : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
                },
                (res) => {
                    if (res.data.success === true) {
                        setDeviceData(res.data.result[0]);
                    } else {
                        console.log(error);
                    }
                }
            );
        }, []);

        const changeHandler = (e) => {
            setDeviceData({ ...deviceData, [e.target.name] : e.target.value })
        }
        // Edit Devices 
        const handleSubmit = (e) => {

            deviceData.userid = DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id
            e.preventDefault();
            UpdateDeviceService(
                deviceData,
                (res) => {
                    if (res.data.success === true) {
                        toast(res.data.message, {
                            toastId : 1,
                        });
                    }
                }
            );
        };
        const [movementPoint, setMovementPoint] = useState(false);
        const [listData, setListData]           = React.useState([]);
        const Listdatanew = (filter) => {
            ListAreaService(filter, (res) => {
                setListData(res.data.result.areaList);
            });
        };
        React.useEffect(() => {
            Listdatanew({ userid : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
        }, []);
        const [coords, setCoords] = React.useState([]);
        const [redius, setReduis] = React.useState(0);
        const [shapetype, setShapeType] = React.useState();
        const title = "Edit Device";
        const { isLoaded } = useJsApiLoader({
            id               : "google-map-script",
            googleMapsApiKey : "AIzaSyDvqub0gVMyj_O-pMmLRkQQKP_UsCMKFXQ",
            libraries        : lib,
        });

        const [map, setMap] = React.useState(null);
        const onLoad = React.useCallback(function callback(map) {
            // This is just an example of getting and using the map instance!!! don't just blindly copy!
            setMap(map);
        }, []);
        const onUnmount = React.useCallback(function callback(map) {
            setMap(null);
        }, []);

        const onPositionChanged = (marker) => {
            if (shapetype == "circle") {
                const checkCircle = new window.google.maps.Circle({
                    radius : parseFloat(redius),
                    center : coords[0],
                });
                var bounds = checkCircle.getBounds();
                if ( bounds.contains( new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng()) ) === true ) {
                    setLatitude(marker.latLng.lat());
                    setLongitude(marker.latLng.lng());
                    setDeviceData({ ...deviceData, latitude: marker.latLng.lat(), longitude: marker.latLng.lng() })
                    setMovementPoint(false);

                } else {
                    toast(`Not Data Save Because your cycle is out of area`, { toastId: 1, });
                    setMovementPoint(true);
                }
            } else {
                const region = new google.maps.Polygon({
                    clickable: false,
                    paths: coords,
                });
                const bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < region.getPath().getLength(); i++) {
                    bounds.extend(region.getPath().getAt(i));
                }
                if ( bounds.contains( new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng()) ) === true ) {
                    setLatitude(marker.latLng.lat());
                    setLongitude(marker.latLng.lng());
                    setDeviceData({ ...deviceData, latitude : marker.latLng.lat(), longitude : marker.latLng.lng() })
                    setMovementPoint(false);
                } else {
                    toast(`Not Data Save Because your cycle is out of area`, { toastId: 1, });
                    setMovementPoint(true);
                }
            }
        };
        const onSave = () => {
            // console.log(index);
            setShow(false);
        };
        // Add Extra Field For SELECT 2
        if (listData.length !== 0) {
            let count = 0;
            listData.map((ele) => {
                ele["value"] = ele.AreaName;
                ele["label"] = ele.AreaName;
                ele['index'] = count++;
            });
        }
        const [index, setIndex] = useState(0);
        
        return isLoaded ? (
            <>
                <div className="page-title-container">
                    <Row className="g-0">
                        {/* Title Start */}
                        <Col className="col-auto mb-3 mb-sm-0 me-auto">
                            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                                <CsLineIcons icon="chevron-left" size="13" />
                                <span className="align-middle text-small ms-1">Dashboard</span>
                            </NavLink>
                            <h1 className="mb-0 pb-0 display-4" id="title"
                                style={{
                                    marginLeft : "0.5rem",
                                    fontWeight : "700",
                                    fontSize   : "1.5rem",
                                    color      : "#5ebce3",
                                }}
                            > {title} </h1>
                        </Col>
                        {/* Title End */}
                    </Row>
                </div>
                <Row>
                    <Col xs="12" className="col-lg order-1 order-lg-0">
                        {/* Address Start */}
                        {/* <h2 className="small-title">Device Register</h2> */}
                    <Card className="mb-5"
                        style={{
                            height: "auto",
                            position: "relative",
                            top: "0rem",
                            paddingTop: "0rem",
                            width: "100%",
                            maxWidth: "70%",
                            margin: "auto",
                        }}
                    >
                        <Card.Body>
                        <h1>Edit Device</h1>
                        <hr style={{ width: "100%", opacity: "0.2" }} />
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-3 pt-5 pb-5">
                                <Col lg="10" className="mx-auto">
                                    <Form.Label
                                    style={{
                                        marginLeft: "5px",
                                        fontSize: "0.8rem",
                                        fontFamily: "inherit",
                                    }}
                                    > Device ID </Form.Label>
                                    <div>
                                        <Form.Control type="text" name="deviceId" value={deviceData.deviceid} disabled onChange={changeHandler} />
                                    </div>
                                    {error && deviceId.length <= 0 ? (
                                        <label style={{ color: "red" }}>
                                            device id can't be empty
                                        </label>
                                    ) : ( "" )}
                                </Col>
                                <Col lg="10" className="mx-auto">
                                    <Form.Label
                                        style={{
                                            marginLeft : "5px",
                                            fontSize   : "0.8rem",
                                            fontFamily : "inherit",
                                        }}
                                    > Device Name </Form.Label>
                                    <div>
                                        <Form.Control type="text" name="devicename" value={deviceData.devicename} placeholder="Enter the device name" onChange={changeHandler} />
                                    </div>
                                    {error && deviceName.length <= 0 ? (
                                        <label style={{ color: "red" }}>
                                            area device can't be empty
                                        </label>
                                    ) : ( "" )}
                                </Col>
                                <Col lg="10" className="mx-auto">
                                    <Form.Label
                                        style={{
                                            marginLeft : "5px",
                                            fontSize   : "0.8rem",
                                            fontFamily : "inherit",
                                        }}
                                    > Area Name </Form.Label>
                                    <div>
                                        {listData.length !== 0 ? (
                                            <>
                                                <Select className="react-select-container" classNamePrefix="react-select"
                                                    options={listData}
                                                    value={listData[index]}
                                                    onChange={ (e) => {
                                                        SingleAreaService({ 
                                                            areanumber : e.AreaNumber, 
                                                            user_id    : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id 
                                                        }, (res) => {
                                                            for (
                                                                    var x = 0;
                                                                    x < res.data.results.List.length;
                                                                    x++
                                                            ) {
                                                                setCoords((current) => [
                                                                ...current,
                                                                    {
                                                                        lat : parseFloat( res.data.results.List[x].lat ),
                                                                        lng : parseFloat( res.data.results.List[x].lng ),
                                                                    },
                                                                ]);
                                                            }
                                                            setReduis(res.data.results.redius);
                                                            setShapeType(res.data.results.shapetype);
                                                            setDeviceData({ 
                                                                ...deviceData, 
                                                                areaid    : e.AreaNumber, 
                                                                latitude  : res.data.results.List[0].lat, 
                                                                longitude : res.data.results.List[0].lng 
                                                            })
                                                        });
                                                    } }
                                                />
                                            </>
                                        ) : null}
                                    </div>
                                    {error && areaName.length <= 0 ? (
                                        <label style={{ color: "red" }}>
                                            area name can't be empty
                                        </label>
                                    ) : ( "" )}
                                </Col>
                                <Col lg="10" className="mx-auto">
                                    <Form.Label 
                                        style={{
                                            marginLeft: "5px",
                                            fontSize: "0.8rem",
                                            fontFamily: "inherit",
                                        }}
                                    > Latitude </Form.Label>
                                    <div>
                                        <Form.Control type="text" placeholder="Enter the latitude " name="latitude" value={deviceData.latitude} onChange={changeHandler} />
                                    </div>
                                    {error && latitude.length <= 0 ? (
                                        <label style={{ color: "red" }}>
                                            latitude can't be empty
                                        </label>
                                    ) : ( "" )}
                                </Col>
                                <Col lg="10" className="mx-auto">
                                    <Form.Label 
                                        style={{
                                            marginLeft : "5px",
                                            fontSize   : "0.8rem",
                                            fontFamily : "inherit",
                                        }}
                                    > Longitude </Form.Label>
                                    <Form.Control type="text" name="longitude" placeholder="Enter the Longitude " value={deviceData.longitude} onChange={changeHandler} />

                                    {error && longitude.length <= 0 ? (
                                        <label style={{ color: "red" }}>
                                            Longitude can't be empty
                                        </label>
                                    ) : ( "" )}
                                </Col>
                                <Col lg="10" className="mx-auto">
                                    <Button variant="primary" style={{ position: "relative", top: "0px" }} onClick={handleShow} >
                                        <span>Map Point</span>{" "}
                                        <CsLineIcons icon="chevron-right" />
                                    </Button>
                                </Col>
                                <Col lg="6"
                                    style={{
                                        width          : "100%",
                                        display        : "flex",
                                        justifyContent : "center",
                                        alignItems     : "center",
                                        marginTop      : "3rem",
                                    }}
                                >
                                    <Button className="btn-icon btn-icon-end" variant="primary" type="reset" href="/device-list">
                                        Cancel <CsLineIcons icon="chevron-right" />
                                    </Button>
                                    {/* <a href="/device-list" className="btn-icon btn-icon-end" style={{backgroundColor: '#1b98d0'}}> Cancel </a> */}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button className="btn-icon btn-icon-end" variant="primary" type="submit"
                                        onClick={() => {
                                            setreset();
                                        }}
                                    > Submit <CsLineIcons icon="chevron-right" />
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        </Card.Body>
                    </Card>
                    {/* Address End */}
                    </Col>
                </Row>
                <Modal show={show} size="lg" onHide={handleClose}>
                    <Modal.Header>
                    <h1>Google Map</h1>
                    {listData.length !== 0 ? (
                        <>
                        <Select
                        className="react-select-container w-75"
                        classNamePrefix="react-select"
                        
                            defaultValue={listData[index]}
                            options={listData}
                            onChange={(e) => {
                            setCoords([]);
                            setReduis(0);
                            setShapeType();
                            console.log(e)
                            SingleAreaService(
                                { areanumber: e.AreaNumber, user_id: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id },
                                (res) => {
                                for (
                                    var x = 0;
                                    x < res.data.results.List.length;
                                    x++
                                ) {
                                    setCoords((current) => [
                                    ...current,
                                    {
                                        lat: parseFloat(
                                        res.data.results.List[x].lat
                                        ),
                                        lng: parseFloat(
                                        res.data.results.List[x].lng
                                        ),
                                    },
                                    ]);
                                }
                                // setIndex(e.index)
                                setareaName(res.data.results.AreaName)
                                setReduis(res.data.results.redius);
                                setShapeType(res.data.results.shapetype);
                                setDeviceData({ ...deviceData, areaid: e.AreaNumber, latitude: res.data.results.List[0].lat, longitude: res.data.results.List[0].lng })
                                }
                            );
                            }}
                        />
                        </>
                    ) : null}

                    </Modal.Header>
                    <Modal.Body>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={coords[0]}
                        zoom={7}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        mapTypeId="terrain"
                    >
                        <Marker
                        position={coords[0]}
                        draggable={true}
                        onDragEnd={onPositionChanged}
                        zIndex={2}
                        />

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
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cencel
                    </Button>
                    <Button variant="primary" disabled={movementPoint} onClick={onSave}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        ) : (
            <></>
        );
    };
export default EditPage;
