    import React, { useEffect, useState } from "react";
    import { NavLink, useHistory } from "react-router-dom";
    import moment from "moment";
    import Select from "react-select";
    import { Row, Col, Button, Form, Modal, } from "react-bootstrap";
    import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination } from 'react-table';
    import HtmlHead from "components/html-head/HtmlHead";
    import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import AddIcon from '@mui/icons-material/Add';
    import classNames from 'classnames';
    import { postRequest, sendWhstpMsg } from "@mock-api/data/datatable";
    import Pagination from "Pagination";
    import { SocketIo, DEFAULT_USER } from 'config.js';
    import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    // import RealTimeNotification from "RealTimeNotification";

    const ControlsSearch = ({ tableInstance }) => {
        const { setGlobalFilter, state: { globalFilter }, } = tableInstance;

        const [value, setValue] = React.useState(globalFilter);
        const onChange = useAsyncDebounce((val) => {
            setGlobalFilter(val || undefined);
        }, 200);
        return (
            <>
                <Form.Control type="text" value={value || ""}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder="Search"
                />
                {value && value.length > 0 ? (
                    <span className="search-delete-icon"
                        onClick={() => {
                            setValue("");
                            onChange("");
                        }}
                    >
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
                <table style={{ "borderSpacing": "0 calc(var(--card-spacing-xs)/10*7)", "borderCollapse": "separate", "width": "100%" }} className={className} {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr key={`header${headerIndex++}`} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, index) => {
                                    return (
                                    <th key={index++}
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={classNames(column.headerClassName, {
                                            sorting_desc : column.isSortedDesc,
                                            sorting_asc  : column.isSorted && !column.isSortedDesc,
                                            sorting      : column.sortable,
                                        })}
                                    >
                                        {column.render('Header')}
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
                                <tr key={`tr.${i++}`} {...row.getRowProps()} >
                                    {row.cells.map((cell, cellIndex) => (
                                        <td key={`td.${cellIndex++}`} {...cell.getCellProps()} className={cell.column.cellClassName} style={{
                                            "border": "1px solid transparent",
                                            "height": "50px",
                                            "borderWsidth": "1px 0",
                                            "background": "var(--foreground)",
                                            "paddingLeft": "var(--card-spacing-sm)",
                                            "paddingRight": "var(--card-spacing-sm)",
                                            "paddingTop": "0.25rem",
                                            "paddingBottom": "0.25rem"
                                        }}>
                                            {cell.render('Cell')}
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

    const ActiveAlert = () => {
        const title                                       = "Active Alert List";
        const description                                 = "Ecommerce Discount Page";
        const history                                     = useHistory();
        
        const [isConnected, setIsConnected]               = useState(SocketIo.connected);
        const [audio_path, setAudioPath]                  = useState('/sound.mp3');
        const [commentDescription, setCommentDescription] = useState("");
        const [show, setShow]                             = useState(false);
        const [show2, setShow2]                           = useState(false);
        const [teamModal, setTeamModal]                   = useState(false);
        const [data, SeLists]                             = useState([]);
        const [itemPerPage, setItemPerpage]               = useState(10);
        const [totalrecord, setTotalrecoard]              = useState(1);
        const [deviceId, setDeviceId]                     = useState();
        const [totalpage, setTotalpage]                   = useState(0);
        const [all_team_list, setAllTeamList]             = useState([]);
        const [teamID, setTeamID]                         = useState('');
        
        const handleClose3                                = () => setTeamModal(false);
        const handleClose2                                = () => setShow2(false);
        const handleClose                                 = () => setShow(false);
        const handleShow2                                 = (id) => {
                                                                setShow2(true);
                                                                setDeviceId(id);
                                                            }
        const [state, setstate] = React.useState({
            currentPage  : 1,
            limit        : itemPerPage,
            areanumber   : 0,
            devicestatus : 2
        });
        const { currentPage, limit, areanumber, devicestatus } = state;
        
        const handlePagination = (current) => {
            setstate({ ...state, currentPage: current });
            if (isConnected) {
                SocketIo.emit('onactivedata', ({ userid : sessionStorage.getItem("user_id"), currentPage: current, limit: limit, areanumber: areanumber, devicestatus: devicestatus }));
            }
        };
        const saveComment = () => {
            if (commentDescription.length !== 0) {
                
                postRequest(`/comment_device`, { device_id: deviceId, user_id : sessionStorage.getItem("user_id"), comment_text: commentDescription }, (result) => {
                   
                    if (result.success == true) {
                        toast.success("Comment add successfully", { toastId: 1 })
                        setShow2(false)
                    }
                });
            }
        }
        const [datalist, setNewData] = useState([]);

        const handleShow = (deviceid) => {
            setShow(true)
            postRequest(`/commentlist`, { device_id: deviceid, user_id : sessionStorage.getItem("user_id")}, (result) => {
                setNewData(result.result);
            });
        };

        const getTeamList = (deviceid) => {
            setDeviceId(deviceid);
            setTeamModal(true)
        }
        const alloteTeam = () => {
            var obj = { 
                userid   : sessionStorage.getItem("user_id"), 
                deviceId : deviceId,
                teamID   : teamID
            }
            postRequest(`/alloteTeam`, obj, (result) => {
                (result.success == true) ? toast.success(result.message) : toast.error(result.message);
                if(result.success == true){
                    sendWhstpMsg('918825331083', 'Hello, Leader One order alloted to you. please check and solve this')
                    setTimeout(() => {
                        //history.push('/alert/active-alert');
                        setTeamModal(false);
                        setTeamModal(false);
                    }, 3000);
                }
            });
        }
        useEffect(() => {
            
            postRequest(`/allTeamList`, { userid : sessionStorage.getItem("user_id") }, (result) => {
                setAllTeamList(result.results);
            });
        }, []);
        useEffect(() => {
            SeLists([]);

            if (isConnected) {
                SocketIo.emit('room', ({ userId : sessionStorage.getItem("user_id") }));
            
                SocketIo.emit('onactivedata', ({ 
                    userId       : sessionStorage.getItem("user_id"), 
                    currentPage  : currentPage, 
                    limit        : limit, 
                    areanumber   : areanumber, 
                    devicestatus : devicestatus 
                }));

                SocketIo.on('onactivedata', (result) => {
                    
                    if (result.deviceList.length > 0) {
                        SeLists(result.deviceList);
                        //  alert_notification("Test","Temp data alert")
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
                SocketIo.off('onactivedata');
                SocketIo.off('activedata');
                SeLists([]);
            };
        }, [currentPage, limit]);


        const columns = React.useMemo(() => {
            return [
            {
                Header          : 'Device Id',
                accessor        : 'deviceid',
                sortable        : true,
                headerClassName : 'text-dark text-medium text-uppercase w-10 px-3',
                Cell            : ({ cell }) => {
                return (
                    <NavLink to={`/pump-information/${cell.row.original.deviceid}`} style={{color: '#24A6F6'}}>
                        {cell.row.original.deviceid}
                    </NavLink>
                );
                },
            },
            { 
                Header          : 'Device Name', 
                accessor        : 'devicename', 
                sortable        : true, 
                headerClassName : 'text-dark text-medium text-uppercase w-10 px-3', 
                cellClassName   : 'text-dark' 
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
                headerClassName : 'text-dark text-medium text-uppercase w-10 px-5', 
                cellClassName   : 'text-dark'
            },
            {
                Header : 'Alert Date', accessor: 'update_at', sortable: true,
                Cell   : (row) => (
                    <>
                        <span>{moment(row.row.original.update_at).format('lll')} </span>
                    </>
                ),
                headerClassName : 'text-dark text-medium text-uppercase w-10 px-3',
                cellClassName   : 'text-dark'
            },
            {
                Header : 'Action', accessor: 'action', sortable: false, Cell: (cell) => {
                    return (<>

                        <button className="btn btn-outline-primary p-2" value={"Add"} onClick={() => handleShow2(cell.row.original.deviceid)}>  {<AddIcon />}</button>
                        <button className="btn btn-outline-primary p-2 mx-2" value={"Add"} onClick={() => handleShow(cell.row.original.deviceid)}>  {<RemoveRedEyeOutlinedIcon />}</button>
                        <button className="btn btn-outline-primary p-2" value={"Assign"} onClick={() => getTeamList(cell.row.original.deviceid)}>  {<AddIcon />}</button>
                    </>)
                },
                headerClassName : 'text-dark text-medium text-uppercase w-10 px-5', 
                cellClassName   : 'text-dark'
            },
            /*{
                Header : 'Temperature Alert', accessor: 'temperature',
                Cell   : (row) => {
                    return (
                        <span>
                        {row.row.original.count_temp == 1 || row.row.original.count_temp == '1' ? <span style={{ color: "red" }}> {row.row.original.temperature} &#8451;</span> : <span>   {row.row.original.temperature}  &#8451;</span>}
                        </span>
                    );
                },
                sortable        : true, 
                headerClassName : 'text-muted text-small text-uppercase w-10', 
                cellClassName   : 'text-alternate'
            },
            {
                Header : 'Humidity Alert', accessor: 'humidity',
                Cell   : (row) => {
                    return (
                        <span>
                        {row.row.original.count_humi == 1 || row.row.original.count_humi == '1' ? <span style={{ color: "red" }}> {row.row.original.humidity}{'%'}</span> : <span> {row.row.original.humidity}{'%'}</span>}
                        </span>

                    );
                },
                sortable        : true, 
                headerClassName : 'text-muted text-small text-uppercase w-10', 
                cellClassName   : 'text-alternate'
            },
            {
                Header : 'Moisture Alert', accessor: 'moisture',
                Cell   : (row) => {
                    return (
                        <span>
                        {row.row.original.count_moist == 1 || row.row.original.count_moist == '1' ? <span style={{ color: "red" }}>{row.row.original.moisture}{'%'}</span> : <span>{row.row.original.moisture}{'%'}</span>}
                        </span>
                    );
                },
                sortable        : true, 
                headerClassName : 'text-muted text-small text-uppercase w-10', 
                cellClassName   : 'text-alternate'
            },
            {
              Header: 'Action',
              accessor: '',
              sortable: false,
              Cell: cell => (

                <NavLink
                  className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
                  to={"/view_map_page/" + cell.row.values.AreaNumber}
                >Link</NavLink>
              ),
              headerClassName: 'text-muted text-small text-uppercase w-20',
              cellClassName: 'text-alternate',
            },*/
            ];
        }, []);

        const tableInstance = useTable({
            columns, 
            data, 
            initialState : {
                sortBy: [{ id: 'areaname', desc: true }]
            }, 
            manualPagination : true
        },  useGlobalFilter,  useSortBy,  usePagination, );

        return (
            <>
            <HtmlHead title={title} description={description} />
            <div className="page-title-container">
                <Row className="g-0">
                    {/* Title Start */}
                    <Col className="col-auto mb-3 mb-sm-0 me-auto">
                        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                        <CsLineIcons icon="chevron-left" size="13" />
                            <span className="align-middle text-small ms-1">Dashboard</span>
                        </NavLink>
                        <h1 className="mb-0 pb-0 display-4" id="title"  style={{ marginLeft: '0.5rem', fontWeight: '400', marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#24A6F6', }}>
                        {title}
                        </h1>
                    </Col>

                    <Col md="3" lg="2" xxl="2" className="mb-1">
                        <div className="d-inline-block float-md-start mt-2 search-input-container w-100 border border-separator bg-foreground">
                            <ControlsSearch tableInstance={tableInstance} />
                            <span className="search-magnifier-icon" style={{backgroundColor: '#24A6F6', color: '#fff',borderRadius: '10px'}}>
                                <CsLineIcons icon="search" />
                            </span>
                        </div>
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            {/* <RealTimeNotification /> */}

            <Row className="mb-3">
                <Col xs="12" className="overflow-scroll tab-scroll">
                    {data.length !== 0 ?
                        <Table className="react-table nowrap responsive" tableInstance={tableInstance} />
                        :
                        <span>No Record</span>
                    }
                </Col>
                <Col className="d-flex justify-content-center">
                    {
                        totalpage > 0 ? 
                        <Pagination total={totalpage} current={currentPage} pagination={(crPage)=> handlePagination(crPage)} />
                        : null
                    }
                </Col>
            </Row>

            {/* view model comment */}
            {/* Add comments popup modal code start from here */}
            <div className="scroll-bar">
                <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                    <Modal.Header closeButton style={{ height: '0px' }}>
                        <Modal.Title>Show Comments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ height: '65vh' }}>
                        <div style={{  height: '60vh', maxHeight: '100%', overflowY:'scroll', overflowX:'hidden', }}>
                            <div>

                                {
                                datalist.length > 0 ? datalist.map((item, index) => {
                                    return (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '1rem 0px' }} >
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
                                        <span style={{  padding: '5px 0px', borderRadius: '10px' }}>{item.comment_text}</span>
                                        <p style={{ fontSize: '8px', textAlign: 'right', paddingTop: '3px',marginRight:'10px' }}>Date: {moment(item.datetime).format('ll')}&nbsp; {moment(item.datetime).format('LT')}</p>
                                        </div>
                                    </div>
                                    )
                                }) : null
                                }
                            </div>
                        </div>
                    </Modal.Body>
                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 2rem' }}>
                        <Button style={{backgroundColor: '#24A6F6', color: '#fff'}} onClick={handleClose} > Close </Button>
                    </div>
                </Modal>
            </div>
            {/* Add comments popup modal code start from here */}

            {/* add comment model */}
            <Modal show={show2} backdrop="static" keyboard={false} onHide={handleClose2}>
                <Modal.Header closeButton style={{ height: '0px' }}>
                    <Modal.Title>Add New Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                        placeholder="Type your comments here" rows="6"
                        onChange={(e) => setCommentDescription(e.target.value)}>
                        </textarea>
                    </div>
                </Modal.Body>
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 2rem' }}>
                    <Button style={{backgroundColor: '#24A6F6', color: '#fff'}} onClick={handleClose2} > Cancel </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button style={{backgroundColor: '#24A6F6', color: '#fff'}} onClick={saveComment} > Add </Button>
                </div>
            </Modal>

            {/* Allote Team of Order */}
            <Modal show={teamModal} backdrop="static" keyboard={false} onHide={handleClose3}>
                <Modal.Header closeButton style={{ height: '0px' }}>
                    <Modal.Title>Allote Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <Select className="react-select-container" name="team_id" classNamePrefix="react-select" options={all_team_list} onChange={(val) => {
                            setTeamID(val.value);
                        }} />
                    </div>
                </Modal.Body>
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 2rem' }}>
                    <Button style={{backgroundColor: '#24A6F6', color: '#fff'}} onClick={handleClose3} > Cancel </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button style={{backgroundColor: '#24A6F6', color: '#fff'}} onClick={alloteTeam} > Add </Button>
                </div>
            </Modal>
            {/* End Allote Team of Order */}

            </>
        );
    };
    export default ActiveAlert;
    // all_team_list