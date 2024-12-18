import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
// API CALLING
import { postRequest} from "../../../@mock-api/data/datatable";
import Pagination from "Pagination";
import { Row, Col, Button, Form, Modal, Dropdown, Tooltip, OverlayTrigger, } from "react-bootstrap";
import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination, useRowSelect, } from "react-table";
import HtmlHead from "components/html-head/HtmlHead";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CsLineIcons from "cs-line-icons/CsLineIcons";
import classNames from "classnames";
import "../../configure/parameters/ProductDetails.css";
import { toast } from "react-toastify";
import { DEFAULT_USER } from "config";

const ControlsSearch = ({ tableInstance }) => {
    const { setGlobalFilter, state: { globalFilter }, } = tableInstance;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((val) => {
        setGlobalFilter(val || undefined);
    }, 200);

    return (
        <>
            <Form.Control type="text" value={value || ""} onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
            }} placeholder="Search" />
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
const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return <input className="form-check-input" type="checkbox" ref={resolvedRef} {...rest} />;
    }
);
const IndeterminateButtonbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (<>
            <button type="button" className="btn btn-primary" style={{ fontSize: "12px", padding: "2px 10px" }}
                ref={resolvedRef} {...rest} > Set Parameter </button>
        </>);
    }
);
let checkList = [];
const Table = ({ tableInstance, className }) => {
    const {
        getTableProps,
        headerGroups,
        selectedFlatRows,
        selectedRowIds,
        getTableBodyProps,
        prepareRow,
        page,
    } = tableInstance;

    React.useEffect(() => {
        if (selectedFlatRows) {

            checkList = selectedFlatRows.map((row) => {
                return { deviceid: row.original.deviceid };
            });
            //console.log(checkList);
        }
        //alert(selectedFlatRows)
    }, [selectedFlatRows, checkList]);

    return (
        <>
            <table style={{
                borderSpacing: "0 calc(var(--card-spacing-xs)/10*7)",
                borderCollapse: "separate", width: "100%",
            }} className={className} {...getTableProps()} >
                <thead>
                    {headerGroups.map((headerGroup, headerIndex) => (
                        <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()} >
                            {headerGroup.headers.map((column, index) => {
                                return (
                                    <th
                                        key={`th.${index}`} {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={classNames(column.headerClassName, {
                                            sorting_desc: column.isSortedDesc,
                                            sorting_asc: column.isSorted && !column.isSortedDesc,
                                            sorting: column.sortable,
                                        })}
                                    >
                                        {column.render("Header")}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} style={{ fontSize: "13px" }}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr key={i++} {...row.getRowProps()}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td key={`td.${cellIndex}`}
                                        {...cell.getCellProps()}
                                        className={cell.column.cellClassName}
                                        style={{
                                            border: "1px solid transparent",
                                            height: "50px",
                                            borderWsidth: "1px 0",
                                            background: "var(--foreground)",
                                            paddingLeft: "var(--card-spacing-sm)",
                                            paddingRight: "var(--card-spacing-sm)",
                                            paddingTop: "0.25rem",
                                            paddingBottom: "0.25rem",
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
let count = 0;
const AreaList = () => {
    // Popup Code start from here
    // const [count, setCount] = useState(0)
    const [checkboxList, setCheckboxList] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [error, setError] = useState(false);
    // Popup Code End from here
    const [itemPerPage, setItemPerpage] = useState(10);
    const [totalrecord, setTotalrecoard] = useState(1);
    const [totalpage, setTotalpage] = useState(0);
    const [founddata, setFoundData] = useState(true);
    const [data, setNewData] = useState([]);
    const [state, setstate] = React.useState({
        currentPage: 1,
        selectedRowIds: "",
    });
    const { currentPage, selectedRowIds } = state;

    const [listData, setListData] = React.useState([]);
    const title = "Parameters";
    const description = "Ecommerce Discount Page";

    const [parameters, setParameters] = useState([]);

    const viewDeviceParameter = (value) => {

        checkList = [];
        checkList.push(value.deviceid);
        setShow(true);
        setParameters({
            alerttemp: value.alerttemp,
            alerthumi: value.alerthumi,
            alertmoisture: value.alertmoisture,
            alerttypetemp: value.alerttypetemp,
            alerttypehumi: value.alerttypehumi,
            alerttypemoisture: value.alerttypemoisture,

            tempMin: value.mintemprange,
            tempMax: value.maxtemprange,  ///   
            moistureMin: value.minmoistrange,
            moistureMax: value.maxmoistrange,  ///
            humidityMin: value.minhumirange,
            humidityMax: value.maxhumirange,
        });

    };
    // pagination
    const handlePagination = (current) => {
        setstate({ ...state, currentPage: current });
        alldatanew({
            userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
            page: current,
            limit: itemPerPage,
        });
    };

    const alldatanew = (filter) => {
        postRequest(`/deviceList`, filter, (res) => {
            if (res.results.deviceList.length !== 0) {
                setTotalrecoard(res.results.totalrecoard);
                setTotalpage(res.results.totalpage);
                setNewData(res.results.deviceList);
            } else {
                setNewData(res.results.deviceList);
                setTotalrecoard(res.results.totalrecoard);
                setTotalpage(res.results.totalpage);
                setFoundData(false);
            }
        });
    };
    React.useEffect(() => {
        alldatanew({
            userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
            page: currentPage,
            limit: itemPerPage,
        });
    }, []);
    const handleShow = () => {
        //if (checkList.length) {
            //setParameters([])
            setShow(true);
            setParameters({

                alerttemp: 0,
                alerthumi: 0,
                alertmoisture: 0,

                alerttypetemp: 0,
                alerttypehumi: 0,
                alerttypemoisture: 0,

                tempMin: 0,
                tempMax: 0,
                moistureMin: 0,
                moistureMax: 0,
                humidityMin: 0,
                humidityMax: 0,
            });

        // } else {
        //     toast.error('Please select device first');
        // }

    };
    // Add Extra Field For SELECT 2
    if (listData.length !== 0) {
        listData.map((ele) => {
            if (ele.id !== 0) {
                ele["value"] = ele.AreaName;
                ele["label"] = ele.AreaName;
            }
        });
    }
    // set parameters
    const handleParameters = () => {

        parameters.checkList = checkList;
        postRequest(`/deviceparameter`, parameters, (res) => {
            if (res.success === true) {
                toast(res.message, { toastId: 1 });
                setShow(false);
                alldatanew({
                    userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
                    page: currentPage,
                    limit: itemPerPage,
                });
            } else {
                toast.error('Parameter not updated, please try again');
                console.log(error);
            }
        });
    };
    const changeParameter = (e) => {
        setParameters({ ...parameters, [e.target.name]: e.target.value });
    };
    const changeRange = (e) => {
        if (e.target.name == 'tempRange') {
            //parameters.alerttypetemp
            setParameters({ ...parameters, ['alerttypetemp']: ((e.target.checked == true) ? 2 : 0) });
        }
        if (e.target.name == 'humidityRange') { //parameters.alerttypehumi
            setParameters({ ...parameters, ['alerttypehumi']: ((e.target.checked == true) ? 2 : 0) });
        }
        if (e.target.name == 'moistureRange') { //parameters.alerttypemoisture
            setParameters({ ...parameters, ['alerttypemoisture']: ((e.target.checked == true) ? 2 : 0) });
        }
        //setParameters({ ...parameters, [e.target.name] : ( e.target.checked ? 1 : 0 ) });
    };
    const columns = React.useMemo(() => {
        return [
            {
                Header          : "Device ID",
                accessor        : "deviceid",
                sortable        : false,
                headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                Cell            : (cell) => {
                    return (
                        <>
                            <NavLink to={`/view_map_page/${cell.row.original.areaid}`}>
                                {cell.row.original.deviceid}{" "}
                            </NavLink>
                        </>
                    );
                },
                
            }, {
                Header          : "Device Name",
                accessor        : "devicename",
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                cellClassName   : "text-alternate",

            }, {
                Header   : "Temperature",
                accessor : "alerttemp",
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

            }, {
                Header   : "Humidity",
                accessor : "alerthumi",  
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
                headerClassName : "text-muted text-small text-uppercase w-10",
                cellClassName   : "text-alternate",

            }, {
                Header   : "Moisture",
                accessor : "alertmoisture",  
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

            }, {
                Header   : "Register Date",
                accessor : "createdat",
                Cell     : (cell) => {
                    return <span>{moment(listData.createdat).format("ll")}</span>;
                },
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 px-2",
                cellClassName   : "text-alternate",

            }, {
                Header   : "Action",
                accessor : "action",
                sortable : false,
                Cell     : ({ cell, toggleRowSelected, toggleAllRowsSelected }) => {
                    const currentState = cell.row.getToggleRowSelectedProps();
                    return (
                        <>
                            <button style={{ backgroundColor: "transparent", marginLeft: "-3rem", border: "none", }} value={"Add"} >
                                <NavLink to={`/device-information/${cell.row.original.deviceid}`} className="text-primary" >
                                    {<RemoveRedEyeOutlinedIcon />}
                                </NavLink>
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <IndeterminateButtonbox
                                {...currentState}
                                onClick={(e) => {
                                    toggleAllRowsSelected(false);
                                    toggleRowSelected(cell.row.id, !currentState.checked);
                                    viewDeviceParameter(cell.row.original);
                                }}
                            />
                        </>
                    );
                },
                headerClassName : "text-muted text-small text-uppercase w-10 px-7",
                cellClassName   : "text-alternate",
            },
        ];
    }, []);

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { sortBy: [{ id: "name", desc: true }] },
            manualPagination: true,
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    headerClassName: "text-muted text-small text-uppercase w-10 px-4",
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div style={{ paddingLeft: "3px" }}>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );
    return (
        <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row className="g-0">
                    {/* Title Start */}
                    <Col className="col-auto mb-3 mb-sm-0 me-auto w-100">
                        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                            <CsLineIcons icon="chevron-left" size="13" />
                            <span className="align-middle text-small ms-1">Dashboard</span>
                        </NavLink>
                        <Row>
                            <Col className="d-flex justify-content-end align-items-center w-100">
                                <Col>
                                    <h1 className="mb-0 pb-0 display-4" id="title"
                                        style={{
                                            marginLeft: "0.5rem",
                                            fontWeight: "400",
                                            marginLeft: "0.5rem",
                                            fontWeight: "700",
                                            fontSize: "1.5rem",
                                            color: "#5ebce3",
                                        }}
                                    >
                                        {title}
                                    </h1>
                                </Col>
                                <Col className="d-flex justify-content-end " sm="5" md="5" lg="2" xxl="2" >
                                    <Button variant="primary" onClick={handleShow}>
                                        Set Para for Multiple Device
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                    {/* Title End */}
                </Row>
            </div>

            <Row className="mb-3">
                <div className="d-flex justify-content-end align-items-center">
                    <Col sm="5" md="5" lg="2" xxl="2" className="mb-1">

                        <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                            <ControlsSearch tableInstance={tableInstance} />
                            <span className="search-magnifier-icon">
                                <CsLineIcons icon="search" />
                            </span>
                            <span className="search-delete-icon d-none">
                                <CsLineIcons icon="close" />
                            </span>
                        </div>
                    </Col>

                    <Col>
                        <Col className="d-flex justify-content-end">
                            <Dropdown align={{ xs: "end" }} className="d-inline-block ms-1"
                                onSelect={(e) => {
                                    setItemPerpage(Number(e));
                                    setstate({ ...state, currentPage: 1 });
                                    alldatanew({
                                        userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
                                        page: 1,
                                        limit: e,
                                    });
                                }}
                            >
                                <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>} >
                                    <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13" >
                                        {itemPerPage} Items
                                    </Dropdown.Toggle>
                                </OverlayTrigger>
                                <Dropdown.Menu className="shadow dropdown-menu-end">
                                    {[10, 20, 50].map((itemPerPage1) => (
                                        <Dropdown.Item key={itemPerPage1} eventKey={itemPerPage1} value={itemPerPage1} >
                                            {itemPerPage1} Items
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Col>
                </div>
                <Col xs="12" className="overflow-scroll">
                    {data.length !== 0 ?
                        <Table className="react-table nowrap" tableInstance={tableInstance} /> : <span>No Record</span>
                    }
                </Col>
                <Col className="d-flex justify-content-center">
                    {totalpage > 0 ? (
                        <Pagination total={totalpage} current={currentPage} pagination={(crPage) => handlePagination(crPage)} />
                    ) : null}
                </Col>
            </Row>
            {/* Card Popup Code start from here Ravi Code */}
            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose} >
                <Modal.Title>
                    <h4 style={{ position: "relative", left: "1.2rem", top: "0.5rem", fontSize: "1.5rem", fontWeight: "500", }} >
                        Alert Parameters
                    </h4>
                </Modal.Title>
                <hr style={{ width: "100%", opacity: "0.2" }} />
                <Modal.Body style={{ padding:"17px 25px"}}>
                    <div className="para-handler">
                        <div className="para-range">
                            <span> Range </span>
                        </div>
                        <div className="para-range-falls">

                            <span> Rises Above </span>
                            <span> Falls Below </span>
                        </div>
                    </div>

                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "centerss",
                        width: "100%", columnGap: "2rem",
                    }} >
                        <span className="text-primary" style={{ fontFamily: "Montserrat", width: "100px", fontSize: "16px" }}>
                            Temperature
                        </span>

                        <Form.Check type='checkbox' reverse name="tempRange" checked={parameters.alerttypetemp == 2 ? true : false} onChange={changeRange} />

                        {parameters.alerttypetemp == 2 ? (<>
                            <Form.Control size="sm" type="text" name="tempMin" placeholder="Min" value={parameters.tempMin} onChange={changeParameter} style={{ width: "111px" }} />
                            <Form.Control size="sm" type="text" name="tempMax" placeholder="Max" value={parameters.tempMax} onChange={changeParameter} style={{ width: "111px" }} />
                        </>)
                        : (<>
                            <Form.Control size="sm" type="text" name="alerttemp" placeholder="Input Temperature" value={parameters.alerttemp} onChange={changeParameter} style={{ width: "111px" }} />

                            <Form style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100px", }} >
                                {["radio"].map((type) => (
                                    <div key={`reverse-${type}`} className="mb-3" style={{ display: "contents" }} >
                                        <Form.Check reverse name="alerttypetemp" value="1" checked={parameters.alerttypetemp == 1 ? true : false} type={type} onChange={changeParameter} />
                                        <Form.Check reverse name="alerttypetemp" value="0" checked={parameters.alerttypetemp == 0 ? true : false} type={type} onChange={changeParameter} />
                                    </div>
                                ))}
                            </Form>
                        </>)}

                    </div>
                    <br />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "centerss", width: "100%", columnGap: "2rem" }}>
                        <span className="text-primary" style={{ fontFamily: "Montserrat", width: "100px", fontSize: "16px" }} >
                            Moisture
                        </span>
                        <Form.Check reverse name="moistureRange" checked={parameters.alerttypemoisture == 2 ? true : false} type='checkbox' onChange={changeRange} />
                        {parameters.alerttypemoisture == 2 ? (<>
                            <Form.Control size="sm" type="text" name="moistureMin" placeholder="Min"  value={parameters.moistureMin} onChange={changeParameter} style={{ width: "111px" }} />
                            <Form.Control size="sm" type="text" name="moistureMax" placeholder="Max"  value={parameters.moistureMax} onChange={changeParameter} style={{ width: "111px" }}/> </>)

                            : (<>
                                <Form.Control size="sm" type="text" name="alertmoisture" placeholder="Input Moisture"
                                    value={parameters.alertmoisture} style={{ width: "111px" }} onChange={changeParameter} />

                                <Form style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    width: "100px"
                                }} >
                                    {["radio"].map((type) => (
                                        <div key={`reverse-${type}`} className="mb-3" style={{ display: "contents" }} >
                                            <Form.Check reverse name="alerttypemoisture" value="1" checked={parameters.alerttypemoisture == 1 ? true : false} type={type} onChange={changeParameter} />
                                            <Form.Check reverse name="alerttypemoisture" value="0" checked={parameters.alerttypemoisture == 0 ? true : false} type={type} onChange={changeParameter} />
                                        </div>
                                    ))}
                                </Form>
                            </>)}
                    </div>
                    <br />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "centerss", width: "100%", columnGap: "2rem" }}>
                        <span className="text-primary" style={{ fontFamily: "Montserrat", width: "100px", fontSize: "16px" }}>
                            Humidity
                        </span>
                        <Form.Check reverse name="humidityRange" checked={parameters.alerttypehumi == 2 ? true : false} type='checkbox' onChange={changeRange} />
                        {parameters.alerttypehumi == 2 ? (<>
                            <Form.Control size="sm" type="text" name="humidityMin" placeholder="Min"  value={parameters.humidityMin} onChange={changeParameter} style={{ width: "111px" }} />
                            <Form.Control size="sm" type="text" name="humidityMax" placeholder="Max"  value={parameters.humidityMax} onChange={changeParameter} style={{ width: "111px" }}/> </>)

                            : (<>
                                <Form.Control size="sm" type="text" name="alerthumi" onChange={changeParameter} value={parameters.alerthumi} placeholder="Input  Humidity" style={{ width: "111px" }} />

                                <Form style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100px" }} >
                                    {["radio"].map((type) => (
                                        <div key={`reverse-${type}`} className="mb-3" style={{ display: "contents" }} >
                                            <Form.Check reverse name="alerttypehumi" value="1" checked={parameters.alerttypehumi == 1 ? true : false} type={type} onChange={changeParameter} />
                                            <Form.Check reverse name="alerttypehumi" value="0" checked={parameters.alerttypehumi == 0 ? true : false} type={type} onChange={changeParameter} />
                                        </div>
                                    ))}
                                </Form>
                            </>)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} style={{ padding: "10px 2rem", margin: "0px 10px" }} >
                        Cancel
                    </Button>
                    <Button onClick={() => handleParameters(checkList)} style={{ padding: "10px 2rem", margin: "0px 10px" }} >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default AreaList;
