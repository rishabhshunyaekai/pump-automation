    import React, { useState } from "react";
    import { NavLink } from "react-router-dom";
    import Select from 'react-select'
    import { Row, Col, Button, Modal, Form, Dropdown, Tooltip, OverlayTrigger, } from "react-bootstrap";

    import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination, } from "react-table";
    import HtmlHead from "components/html-head/HtmlHead";
    import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
    //import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
    import EditIcon from "@mui/icons-material/Edit";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import classNames from "classnames";
    import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
    import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
    //import { DEFAULT_USER } from "config";
    import "../configure/parameters/ProductDetails.css";
    import { postRequest} from "../../@mock-api/data/datatable";
    import Pagination from "../../Pagination";

    import { GoogleMap, useJsApiLoader, Circle, Polygon, Marker, } from "@react-google-maps/api";
    import { toast } from "react-toastify";
    const containerStyle = { width: "100wv", height: "600px", };
    const center = { lat: 28.6139, lng: 77.209, };
    let lib      = ["places", "geometry", "visualization", "drawing"];
    const google = (window.google = window.google ? window.google : {});
    const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const ControlsSearch = ({ tableInstance }) => {
        const { setGlobalFilter, state: { globalFilter }, } = tableInstance;

        const [value, setValue] = React.useState(globalFilter);
        const onChange = useAsyncDebounce((val) => {
            setGlobalFilter(val || undefined);
        }, 200);

        return (
            <>
                <Form.Control type="text" value={value || ""} onChange={(e)=>{ setValue(e.target.value);onChange(e.target.value);}} placeholder="Search" />
                {value && value.length > 0 ? (
                    <span className="search-delete-icon" onClick={() => { setValue(""); onChange(""); }} >
                        <CsLineIcons icon="close" />
                    </span>
                ) : (
                    <span className="search-magnifier-icon pe-none">
                        <CsLineIcons icon="search" />
                    </span>
                )}
            </>
        );
    };
    const Table = ({ tableInstance, className }) => {
        const { getTableProps, headerGroups, rows, getTableBodyProps, prepareRow, page, } = tableInstance;

        return (
            <>
                <table style={{ borderSpacing: "0 calc(var(--card-spacing-xs)/10*7)", borderCollapse: "separate", width: "100%", }} className={className}
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column, index) => {
                                    return (
                                        <th key={`th.${index}`}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className={classNames(column.headerClassName, {
                                                sorting_desc : column.isSortedDesc,
                                                sorting_asc  : column.isSorted && !column.isSortedDesc,
                                                sorting      : column.sortable,
                                            })}
                                        >
                                            {column.render("Header")}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr key={`tr.${i}`} {...row.getRowProps()} >
                                    {row.cells.map((cell, cellIndex) => (
                                        <td key={`td.${cellIndex}`}
                                            {...cell.getCellProps()}
                                            className={cell.column.cellClassName}
                                            style={{
                                                border        : "1px solid transparent",
                                                height        : "50px",
                                                borderWsidth  : "1px 0",
                                                background    : "var(--foreground)",
                                                paddingLeft   : "var(--card-spacing-sm)",
                                                paddingRight  : "var(--card-spacing-sm)",
                                                paddingTop    : "0.25rem",
                                                paddingBottom : "0.25rem",
                                            }}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    };

    const DeviceList = () => {
        const [show, setShow] = useState(false);
        const handleClose = () => {
            seDevicePoint("");
            setShow(false);
        };
        const [show1, setShow1]           = useState(false);
        const [deleteid, setDeleteId]     = useState(0);
        const [areanumber, setAreaNumber] = React.useState(0);
        const handleClose1 = () => {
            setShow1(false);
        };
        // const handleShow1 = (obj) => {
        //     setDeleteId(obj);
        //     setShow1(true);
        // };
        const [devicepoint, seDevicePoint] = React.useState("");
        const handleShow = (areanumberdata) => {
            seDevicePoint({
                id     : areanumberdata.id,
                areaid : areanumberdata.areaid,
                lat    : parseFloat(areanumberdata.latitude),
                lng    : parseFloat(areanumberdata.longitude),
            });
            setAreaNumber(areanumberdata.areaid);
            singledatanew({ areanumber : areanumberdata.areaid, user_id : sessionStorage.getItem("user_id") });
            setShow(true);
        };
        // Popup Code End from here

        const title        = "Device List";
        const description  = "Ecommerce Discount Page";
        const { isLoaded } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: googleMapApiKey, libraries: lib, });

        const [coords, setCoords] = React.useState([]);

        const [redius, setReduis] = React.useState(0);
        const [shapetype, setShapeType] = React.useState();
        const singledatanew = (filter) => {
            setCoords([]);
            setReduis(0);
            setShapeType();
            postRequest(`/areaSingle`, filter, (res) => {
                for (var x = 0; x < res.results.List.length; x++) {
                    setCoords((current) => [
                    ...current,
                    {
                        lat: parseFloat(res.results.List[x].lat),
                        lng: parseFloat(res.results.List[x].lng),
                    },
                    ]);
                }
                setReduis(res.results.redius);
                setShapeType(res.results.shapetype);
            });
        };

        const [map, setMap] = React.useState(null);
        const [mapcircle, setMapCircle] = React.useState(false);
        const onLoad = React.useCallback(function callback(map) {
            // This is just an example of getting and using the map instance!!! don't just blindly copy!
            setMap(map);
        }, []);

        const onUnmount = React.useCallback(function callback(map) {
            setMap(null);
        }, []);
        const onPositionChanged = (marker) => {
            if (shapetype === "circle") {
            const checkCircle = new window.google.maps.Circle({
                radius: parseFloat(redius),
                center: coords[0],
            });
            var bounds = checkCircle.getBounds();
            if (
                bounds.contains(
                new google.maps.LatLng(marker.latLng.lat(), marker.latLng.lng())
                ) === true
            ) {
                seDevicePoint({
                ...devicepoint,
                lat: marker.latLng.lat(),
                lng: marker.latLng.lng(),
                });
                setMapCircle(false)
                console.log(`Valid`);
            } else {
                setMapCircle(true)
                // toast("Not Data Save Because your cycle is out of area", {
                //   toastId: 1
                // })
            // console.log(`Not Data Save Because your cycle is out of area`);
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
                ) === true
            ) {
                seDevicePoint({
                ...devicepoint,
                lat: marker.latLng.lat(),
                lng: marker.latLng.lng(),
                });
                setMapCircle(false)
                console.log(`Valid`);
            } else {
                setMapCircle(true)
                // toast("Not Data Save Because your cycle is out of area", {
                //   toastId: 1
                // })
                //console.log(`Not Data Save Because your cycle is out of area`);
            }
            }
        };

        const [itemPerPage, setItemPerpage] = useState(10);
        const [totalrecord, setTotalrecoard] = useState(1);
        const [totalpage, setTotalpage] = useState(0);
        const [founddata, setFoundData] = useState(true);
        const [data, setNewData] = useState([]);
        const [listData, setListData] = React.useState([]);
        const [state, setstate] = React.useState({
            currentPage: 1,
        });
        const { currentPage } = state;

        const Listdatanew = (filter) => {
            postRequest(`/areaList`, filter, (res) => {
                setListData(res.result.areaList);
            });
        };
        React.useEffect(() => {
            Listdatanew({ userid: sessionStorage.getItem("user_id") });
        }, []);

        const handlePagination = (current) => {
            setstate({ ...state, currentPage: current });
            alldatanew({
                userid : sessionStorage.getItem("user_id"),
                page   : current,
                limit  : itemPerPage,
            });
        };

    const alldatanew = (filter) => {
        postRequest(`/deviceList`, filter, (res) => {
            if (res.results.totalrecoard > 0) {
                setTotalrecoard(res.results.totalrecoard);
                setTotalpage(res.results.totalpage);
                setNewData(res.results.deviceList);
            } else {
                setFoundData(false);
            }
        });
    };

    React.useEffect(() => {
        alldatanew({
            userid : sessionStorage.getItem("user_id"),
            page   : currentPage,
            limit  : itemPerPage,
        });
    }, []);

    const deleteEvent = () => {
        postRequest(`/devicedelete`, { id: deleteid.deviceid }, (res) => {
            
            if (res.success === true) {
                toast(res.message, { toastId: 1, }); //success: true, message
            } 
            alldatanew({
                userid : sessionStorage.getItem("user_id"),
                page   : currentPage,
                limit  : itemPerPage,
            });
            setShow1(false);
        });
    };


    // Add Extra Field For SELECT 2
    if (listData.length !== 0) {
        listData.map((ele) => {
        ele["value"] = ele.AreaName;
        ele["label"] = ele.AreaName;
        });
    }

    let index = 0
    if (areanumber !== 0)
        index = listData.findIndex((object) => {
        return object.AreaNumber === areanumber;
        });


        const columns = React.useMemo(() => {
            return [
                {
                    Header          : "Device ID",
                    accessor        : "deviceid",
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                    Cell : ({ cell }) => {
                        return (
                            <NavLink to={`/device-information/${cell.row.original.deviceid}`}>
                                {cell.row.original.deviceid}
                            </NavLink>
                        );
                    },
                },
                {
                    Header          : "Device Name",
                    accessor        : "devicename",
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                    cellClassName   : "text-alternate",
                },
                {
                    Header   : "Temperature Alert",
                    accessor : "temperature",
                    Cell     : (cell) => {
                        return (
                            <> 
                            { cell.row.original.alerttypetemp === 2 ? 
                                ( <span>{cell.row.original.mintemprange} - {cell.row.original.maxtemprange} </span>)
                            : 
                            (<>
                                <span className="">
                                    {cell.row.original.alerttemp}
                                    <span>
                                        { cell.row.original.alerttypetemp === 1 ? <ArrowDropUpIcon style={{ color: "green" }} /> : <ArrowDropDownIcon style={{ color: "red" }} /> }
                                    </span>
                                </span>
                            </>)
                            }
                        </>
                        );
                    },
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10",
                    cellClassName   : "text-alternate",
                },
                {
                    Header   : "Humadity Alert",
                    accessor : "humidity",
                    Cell     : (cell) => {
                        return (
                            <> 
                                { cell.row.original.alerttypehumi === 2 ? 
                                    ( <span>{cell.row.original.minhumirange} - {cell.row.original.maxhumirange} </span>)
                                : 
                                (<>
                                    <span className="">
                                        {cell.row.original.alerthumi}
                                        <span>
                                            { cell.row.original.alerttypehumi === 1 ? <ArrowDropUpIcon style={{ color: "green" }} /> : <ArrowDropDownIcon style={{ color: "red" }} /> }
                                        </span>
                                    </span>
                                </>)
                                }
                            </>
                        );
                    },
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10 ",
                    cellClassName   : "text-alternate",
                },
                {
                    Header   : "Moisture Alert",
                    accessor : "moisture",
                    Cell     : (cell) => {
                        return (
                            <> 
                                { cell.row.original.alerttypemoisture === 2 ? 
                                    ( <span>{cell.row.original.minmoistrange} - {cell.row.original.maxmoistrange} </span> )
                                : 
                                (<>
                                    <span className="">
                                        {cell.row.original.alertmoisture}
                                        <span>
                                            {cell.row.original.alerttypemoisture === 1 ? <ArrowDropUpIcon style={{ color: "green" }} /> : <ArrowDropDownIcon style={{ color: "red" }} />}
                                        </span>
                                    </span>
                                </>)
                                }
                            </>
                        );
                    },
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10 ",
                    cellClassName   : "text-alternate",
                },
                {
                    Header : 'Fire Alert', accessor: 'fire',
                    Cell   : (row) => {
                        return (
                            <>
                                {row.row.original.fire == 1 || row.row.original.fire == '1' ? <span style={{ color: "red" }}>Detected </span> : "Not Detected"}
                            </>
                        );
                    },
                    sortable        : true,
                    headerClassName : "text-muted text-small text-uppercase w-10 px-4 ",
                    cellClassName   : "text-alternate",
                },
                {
                    Header   : "Area Re-Assign",
                    accessor : "areaid",
                    sortable : false,
                    Cell     : (cell) => (
                        <Button variant="primary"
                            style={{
                                fontSize     : "12px",
                                padding      : "4px 30px",
                                borderRadius : "5px",
                                marginLeft   : "-1.5rem",
                            }}
                            onClick={() => {
                                handleShow(cell.row.original);
                            }}
                        >
                            Re-Assign
                        </Button>
                    ),
                    headerClassName : "text-muted text-small text-uppercase w-10 px-2",
                    cellClassName   : "text-alternate",
                },
                {
                    Header   : "Action",
                    accessor : "",
                    sortable : false,
                    Cell     : (cell) => {
                        return (
                            <>
                                <button style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                    <NavLink to={`/edit-device/${cell.row.original.deviceid}`}
                                    className="text-primary">
                                        {<EditIcon />}
                                    </NavLink>
                                </button>
                                <button style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                    <NavLink to={`/device-information/${cell.row.original.deviceid}`} className="text-primary" >
                                        {<RemoveRedEyeOutlinedIcon />}
                                    </NavLink>
                                </button>
                                {/* <button className="text-primary" onClick={() => { handleShow1(cell.row.original); }} style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                    {<DeleteOutlineOutlinedIcon />}
                                </button> */}
                            </>
                        );
                    },
                    headerClassName : "text-muted text-small text-uppercase w-10 px-7",
                    cellClassName   : "text-alternate",
                },
            ];
        }, []);

    const handleSave = () => {
        devicepoint.areaid = areanumber;
        if(mapcircle==false){
            postRequest(`/reassigndevice`, devicepoint, (res) => {
                if (res.success == true) {
                    toast("Area update successfully", { toastId: 1 })
                    handleClose();
                    alldatanew({
                        userid : sessionStorage.getItem("user_id"),
                        page   : currentPage,
                        limit  : itemPerPage,
                    });
                } 
            });
        } else {
            toast("Not Data Save Because your cycle is out of area", { toastId: 1 })
        }
    
    };
    const tableInstance = useTable(
        {
        columns,
        data,
        initialState: {
            sortBy: [{ id: "areaname", desc: true }],
        },
        manualPagination: true,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return isLoaded ? (
        <>
        <HtmlHead title={title} description={description} />
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
                <h1 className="mb-0 pb-0 display-4" id="title"  style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
                {title}
                </h1>
            </Col>
            {/* Title End */}
            </Row>
        </div>

        <Row className="mb-3">
            <Col md="5" lg="3" xxl="2" className="mb-1">
            {/* Search Start */}
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                <ControlsSearch tableInstance={tableInstance} />
                <span className="search-magnifier-icon">
                <CsLineIcons icon="search" />
                </span>
                {/* <span className="search-delete-icon d-none">
                <CsLineIcons icon="close" />
                </span> */}
            </div>
            {/* Search End */}
            </Col>
            <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
            {/* Length Start */}
            <Dropdown
                align={{ xs: "end" }}
                className="d-inline-block ms-1"
                onSelect={(e) => {
                setItemPerpage(Number(e));
                setstate({ ...state, currentPage: 1 });
                alldatanew({
                    userid : sessionStorage.getItem("user_id"),
                    page   : 1,
                    limit  : e,
                });
                }}
            >
                <OverlayTrigger
                delay={{ show: 1000, hide: 0 }}
                placement="top"
                overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}
                >
                <Dropdown.Toggle
                    variant="foreground-alternate"
                    className="shadow sw-13"
                >
                    {itemPerPage} Items
                </Dropdown.Toggle>
                </OverlayTrigger>
                <Dropdown.Menu className="shadow dropdown-menu-end">
                {[10, 20, 50].map((itemPerPage1) => (
                    <Dropdown.Item
                    key={itemPerPage1}
                    eventKey={itemPerPage1}
                    value={itemPerPage1}
                    >
                    {itemPerPage1} Items
                    </Dropdown.Item>
                ))}
                </Dropdown.Menu>
            </Dropdown>
            {/* Length End */}
            </Col>
        </Row>

        <Row className="mb-3">
            <Col className="w-100 overflow-scroll">
            {data.length !== 0 ?
                <Table className="react-table nowrap" tableInstance={tableInstance} />
                :
                <span>No Record</span>
            }
            </Col>
        </Row>

        {/* Pagination Start */}
        <div className="d-flex justify-content-center mt-5">
            {totalpage > 0 ? (
            <Pagination
                total={totalpage}
                current={currentPage}
                pagination={(crPage) => handlePagination(crPage)}
            />
            ) : null}
        </div>
        {/* Pagination End */}

        {/* Delete Model Start */}
        <Modal size="sm" show={show1} onHide={handleClose1}>
            <Modal.Header>
            <Modal.Title>Delete Operation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this device?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
                Cancel
            </Button>
            <Button variant="primary" onClick={deleteEvent}>
                Yes
            </Button>
            </Modal.Footer>
        </Modal>
        {/* Delete Model End */}


        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header>
            {listData.length !== 0 ? (
                <>
                <h2>Re-Assign Area</h2>
                <Select
                className="react-select-container w-50"
                classNamePrefix="react-select"
                
                    defaultValue={listData[index]}
                    options={listData}
                    onChange={(val) => {
                        setAreaNumber(val.AreaNumber);
                        singledatanew({ areanumber: val.AreaNumber, user_id: sessionStorage.getItem("user_id") });
                    }}
                />
                </>
            ) : null}

            </Modal.Header>
            <Modal.Body>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={coords[0]}
                zoom={9}
                onLoad={onLoad}
                onUnmount={onUnmount}
                mapTypeId="terrain"
            >
                {devicepoint != "" ? (
                <Marker
                    key={devicepoint.id}
                    position={{ lat: parseFloat(devicepoint.lat), lng: parseFloat(devicepoint.lng) }}
                    // position={coords[0]}
                    draggable={true}
                    onDragEnd={onPositionChanged}
                    zIndex={2}
                />
                ) : null}

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
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Save
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    ) : (
        <></>
    );
    };
    export default DeviceList;
