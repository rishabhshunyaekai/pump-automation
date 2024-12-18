import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import "../../configure/parameters/ProductDetails.css";
import { GoogleMap, Data, DrawingManager, useJsApiLoader, Circle, Polygon, Marker, } from "@react-google-maps/api";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AddAreaService } from "../../../@mock-api/data/datatable"
import { toast } from "react-toastify";
import { DEFAULT_USER } from "config";
const containerStyle = {
  width: "100wv",
  height: "600px",
};
const center = {
  lat: 28.6139,
  lng: 77.209,
};

//const google = window.google;
let lib = ["places", "geometry", "visualization", "drawing"];

let shapename = "polygon";
const CreateArea = () => {
  const title = "Create Area";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDvqub0gVMyj_O-pMmLRkQQKP_UsCMKFXQ",
    libraries: lib,
  });

  const [map, setMap] = React.useState(null);
  const [selectedShape, setSelectedShape] = React.useState(null);
  const [drawingMode, setDrawingMode] = React.useState("center");

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const options = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 73119.04413883488,
    zIndex: 1,
  };

  const optionspoly = {
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
  };

  let latlngdata = [];
  const [latlngarr, setLatlngarr] = useState([]);

  const closeModal = () => {
    setShow(false);
    setDrawingMode(null);
    selectedShape.setMap(null);
    latlngdata = [];
    setLatlngarr([]);

  };


  const handleOverlayComplete = (event) => {
    setDrawingMode(null);

    //return;
    latlngdata = [];
    if (event.type !== window.google.maps.drawing.OverlayType.MARKER) {
      var newShape = event.overlay;
      newShape.type = event.type;

      setShow(true);
      if (event.type == "circle") {
        latlngdata.push({
          shapetype: "circle",
          redius: event.overlay.getRadius(),
          lat: event.overlay.getCenter().lat(),
          lng: event.overlay.getCenter().lng(),
        });
      }

      if (event.type == "polygon") {
        event.overlay
          .getPath()
          .getArray()
          .map((latlng) => {
            var lat = latlng.lat();
            var lon = latlng.lng();
            latlngdata.push({
              shapetype: "polygon",
              redius: 0,
              lat: lat,
              lng: lon,
            });
          });
      }

      setLatlngarr(latlngdata);
      setSelectedShape(newShape);
    }
  };

  const [show, setShow] = useState(false);
  const validationSchema = Yup.object().shape({
    areaname: Yup.string().required('areaname is required')
  });

  const initialValues = { areaname: '' };
  const onSubmit = (values) => {
    setLatlngarr([]);
    var uniqueNumber = Math.floor(Math.random() * 1000000000);
    if (latlngarr.length > 0) {
      for (var x = 0; x < latlngarr.length; x++) {
        latlngarr[x].AreaName = values.areaname;
        latlngarr[x].AreaNumber = uniqueNumber;
        latlngarr[x].userid = DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id;
      }

      AddAreaService(JSON.stringify({ 'myArray': latlngarr }), result => {
        if (result.success == true) {
          toast(result.message, {
            toastId: 1
          })
          setShow(false);
          selectedShape.setMap(null);
          latlngdata = [];
          setLatlngarr([]);
        } else {
          console.log("--", result)
        }
      });
    }
  }

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;


  return isLoaded ? (
    <>
      <div className="page-title-container">
        <Row className="g-0">
          {/* {/ Title Start /} */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Dashboard</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '400', marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
              {title}
            </h1>
          </Col>
          {/* {/ Title End /} */}
        </Row>
      </div>


      <Row className="mb-5 g-2">
        <Col>
          <div style={{ marginTop: '2rem' }} >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={7}
              onLoad={onLoad}
              onUnmount={onUnmount}
              mapTypeId="terrain">

              <DrawingManager
                options={{
                  drawingMode: window.google.maps.drawing.OverlayType.MARKER,
                  drawingControl: true,
                  drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                      window.google.maps.drawing.OverlayType.CIRCLE,
                      window.google.maps.drawing.OverlayType.POLYGON,
                    ],
                  },
                }}
                drawingMode={drawingMode}
                onOverlayComplete={handleOverlayComplete} />
              <></>
            </GoogleMap>
          </div>
        </Col>
      </Row>

      <Modal size="sm" aria-labelledby="example-modal-sizes-title-sm" show={show}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton onClick={closeModal}>
            <Modal.Title>Fill Area Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <Form.Control
                type="text"
                placeholder="Enter the areaname"
                name="areaname"
                autoFocus
                value={values.areaname}
                onChange={handleChange} />
              {errors.areaname && touched.areaname && <div className="d-block invalid-tooltip">{errors.areaname}</div>}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
            <Button variant="primary" type="submit">Save changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default CreateArea;
