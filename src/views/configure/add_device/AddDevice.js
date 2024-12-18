import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Select from "react-select";
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  Modal,
} from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import moment from "moment";
import { toast } from "react-toastify"
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  GoogleMap,
  Data,
  DrawingManager,
  useJsApiLoader,
  Circle,
  Polygon,
  Marker,
} from "@react-google-maps/api";
import {
  AddDeviceService,
  ListAreaService,
  SingleAreaService,
} from "../../../@mock-api/data/datatable";
import { DEFAULT_USER } from "config";

const containerStyle = {
  width: "100wv",
  height: "600px",
};
const center = {
  lat: 28.6139,
  lng: 77.209,
};
let lib = ["places", "geometry", "visualization", "drawing"];
const google = (window.google = window.google ? window.google : {});


const AddDevice = () => {
  // Popup Code start from here
  const [show, setShow] = useState(false);
  const history = useHistory()

  // Popup Code End from here

  const newdate = moment().format("L");
  const title = "Add Device";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDvqub0gVMyj_O-pMmLRkQQKP_UsCMKFXQ",
    libraries: lib,
  });

  const [map, setMap] = React.useState(null);
  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [movementPoint, setMovementPoint] = useState(false);
  const [coords, setCoords] = React.useState([]);
  // const [bikeListData, setBikeListData] = React.useState([]);
  const [listData, setListData] = React.useState([]);
  const [redius, setReduis] = React.useState(0);
  const [shapetype, setShapeType] = React.useState();
  const [areanumber, setAreaNumber] = React.useState(0);
  const initialValues = {
    deviceid: "",
    userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
    devicename: "",
    areaid: areanumber,
    regisdate: newdate,
    latitude: "",
    longitude: "",
  };

  const Listdatanew = (filter) => {
    ListAreaService(filter, (res) => {
      setListData(res.data.result.areaList);
    });
  };

  React.useEffect(() => {
    Listdatanew({ userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id });
  }, []);

  const handleClose = () => {
    // formik.setFieldValue("latitude", "");
    // formik.setFieldValue("longitude", "");
    setShow(false);
  };
  const handleShow = () => {
    if (listData.length === 0) {
      toast('Please create a area than register your devices', {
        toastId: 1,
      })
      return
    }
    if (values.latitude && values.latitude) {
      setCoords([]);
      setReduis(0);
      setShapeType();

      SingleAreaService({ areanumber: areanumber, user_id: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id }, (res) => {
        for (var x = 0; x < res.data.results.List.length; x++) {
          setCoords((current) => [
            ...current,
            {
              lat: parseFloat(res.data.results.List[x].lat),
              lng: parseFloat(res.data.results.List[x].lng),
            },
          ]);
        }
        setReduis(res.data.results.redius);
        setShapeType(res.data.results.shapetype);
        setShow(true);
      });
    } else {
      toast('Please select area name', {
        toastId: 1
      })
    }
  };

  const onPositionChanged = (marker) => {
    if (shapetype == "circle") {
      const checkCircle = new window.google.maps.Circle({
        radius: parseFloat(redius),
        center: coords[0],
      });
      var bounds = checkCircle.getBounds();
      if (
        bounds.contains(
          new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng())
        ) == true
      ) {
        formik.setFieldValue("latitude", marker.latLng.lat());
        formik.setFieldValue("longitude", marker.latLng.lng());
        setMovementPoint(false);
        console.log(`Valid`);
      } else {
        setMovementPoint(true);
        console.log(`Not Data Save Because your cycle is out of area`);
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
      if (
        bounds.contains(
          new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng())
        ) == true
      ) {
        formik.setFieldValue("latitude", marker.latLng.lat());
        formik.setFieldValue("longitude", marker.latLng.lng());
        console.log(`Valid`);
        setMovementPoint(false);
      } else {
        setMovementPoint(true);
        console.log(`Not Data Save Because your cycle is out of area`);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    deviceid: Yup.string().required("deviceId is required"),
    devicename: Yup.string().required("deviceName is required"),
    latitude: Yup.string().required("latitude is required"),
    longitude: Yup.string().required("longitude is required"),
  });
  const onSave = () => {
    setShow(false);
  };

  const onSubmit = (values) => {
    values.areaid = areanumber;
    if (values.areaid != "0" || values.areaid != 0) {
      AddDeviceService(values, (result) => {
        toast(result.message)
        if (result.success == true) {
          formik.resetForm()
        } else {
        }
      });
    } else {
    }
  };

  // Add Extra Field For SELECT 2
  if (listData.length !== 0) {
    listData.map((ele) => {
      ele["value"] = ele.AreaName;
      ele["label"] = ele.AreaName;
    });
  }

  let index = 0;
  //const[index,SetIndex]=useState(0);
  if (areanumber !== 0){
    index = listData.findIndex((object) => {
      return object.AreaNumber === areanumber;
    });
   // SetIndex(index1)
  }
   

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return isLoaded ? (
    <>
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink
              className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
              to="/"
            >
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Dashboard</span>
            </NavLink>
            <h1
              className="mb-0 pb-0 display-4"
              id="title"
              style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}
            >
              {title}
            </h1>
          </Col>
          {/* Title End */}
        </Row>
      </div>

      <Row>
        <Col className="col-lg">
          {/* Address Start */}
          <Card
            className="mb-5"
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
              <h1>Device Register</h1>
              <hr style={{ width: "100%", opacity: "0.2" }} />

              <Form onSubmit={handleSubmit}>
                <Row className="g-3 pt-5 pb-5">
                  <Col lg="8" className="mx-auto">
                    <Form.Label>Device Id</Form.Label>
                    <div className="">
                      <Form.Control
                        type="text"
                        placeholder="Enter the device id"
                        name="deviceid"
                        value={values.deviceid}
                        onChange={handleChange}
                      />

                      {errors.deviceid && touched.deviceid && <div className="d-block invalid-tooltip">{errors.deviceid}</div>}
                    </div>
                  </Col>

                  <Col lg="8" className="mx-auto">
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    >
                      Device Name
                    </Form.Label>
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Enter the device name"
                        name="devicename"
                        value={values.devicename}
                        onChange={handleChange}
                      />
                      {errors.devicename && touched.devicename && (
                        <div className="d-block invalid-tooltip">
                          {errors.devicename}
                        </div>
                      )}
                    </div>
                  </Col>

                  {listData.length !== 0 ? (
                    <Col lg="8" className="mx-auto">
                      <>
                        <Form.Label
                          style={{
                            marginLeft: "5px",
                            fontSize: "0.8rem",
                            fontFamily: "inherit",
                          }}
                        >
                          Area Name
                        </Form.Label>
                        <div>
                          <Select
                             className="react-select-container"
                             classNamePrefix="react-select"
                            defaultValue={listData[index]}
                            options={listData}
                            onChange={(val) => {
                              index = listData.findIndex((object) => {
                                return object.AreaNumber === val.AreaNumber;
                              });
                              
                              setAreaNumber(val.AreaNumber);
                              formik.setFieldValue("latitude", "");
                              formik.setFieldValue("longitude", "");
                              SingleAreaService(
                                { areanumber: val.AreaNumber, user_id: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id },
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
                                  formik.setFieldValue(
                                    "latitude",
                                    parseFloat(res.data.results.List[0].lat)
                                  );
                                  formik.setFieldValue(
                                    "longitude",
                                    parseFloat(res.data.results.List[0].lng)
                                  );
                                  setReduis(res.data.results.redius);
                                  setShapeType(res.data.results.shapetype);
                                }
                              );
                            }}
                          />
                        </div>
                      </>
                    </Col>
                  ) : null}

                  <Col lg="8" className="mx-auto">
                    <Form.Label>Register Date</Form.Label>
                    <div>
                      <Form.Control
                        type="text"
                        value={values.regisdate}
                        disabled
                      />
                    </div>
                  </Col>

                  <Col lg="8" className="mx-auto">
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    >
                      Latitude
                    </Form.Label>
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Enter the latitude "
                        value={values.latitude}
                        onChange={handleChange}
                      />
                      {errors.latitude && touched.latitude && (
                        <div className="d-block invalid-tooltip">
                          {errors.latitude}
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg="8" className="mx-auto">
                    <Form.Label
                      style={{
                        marginLeft: "5px",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    >
                      Longitude
                    </Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter the Longitude "
                      value={values.longitude}
                      onChange={handleChange}
                    />
                    {errors.longitude && touched.longitude && (
                      <div className="d-block invalid-tooltip">
                        {errors.longitude}
                      </div>
                    )}
                  </Col>

                  <Col lg="8" className="mx-auto">
                    <Button
                      variant="primary"
                      style={{ position: "relative", top: "0px" }}
                      onClick={handleShow}
                    >
                      <span>Map Point</span>
                      <CsLineIcons icon="chevron-right" />
                    </Button>
                  </Col>
                  <Col
                    lg="6"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "3rem",
                    }}
                  >
                    <Button className="btn-icon btn-icon-end" variant="primary" type="reset" href="/device-list">
                      Cancel <CsLineIcons icon="chevron-right" />
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      className="btn-icon btn-icon-end"
                      variant="primary"
                      type="submit"
                    >
                      Submit
                      <CsLineIcons icon="chevron-right" />
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
          {listData.length !== 0 ? (
            <>
              <h2>Google Map</h2>
              <Select
               className="react-select-container w-50"
               classNamePrefix="react-select"
             
                defaultValue={listData[index]}
                options={listData}
                onChange={(val) => {
                  index = listData.findIndex((object) => {
                    return object.AreaNumber === val.AreaNumber;
                  });
                  
                  setAreaNumber(val.AreaNumber);
                  formik.setFieldValue("latitude", "");
                  formik.setFieldValue("longitude", "");
                  setCoords([]);
                  setReduis(0);
                  setShapeType();
                  SingleAreaService(
                    { areanumber: val.AreaNumber, user_id: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id },
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
                      formik.setFieldValue(
                        "latitude",
                        parseFloat(res.data.results.List[0].lat)
                      );
                      formik.setFieldValue(
                        "longitude",
                        parseFloat(res.data.results.List[0].lng)
                      );
                      setReduis(res.data.results.redius);
                      setShapeType(res.data.results.shapetype);
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

export default AddDevice;


