    import React, { useEffect, useState } from "react";
    import { NavLink } from "react-router-dom";
    import { Row, Col, Button, Form, Card, Modal, } from "react-bootstrap";
    import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination } from 'react-table';
    //import { Col, Row } from 'react-bootstrap';
    import HtmlHead from "components/html-head/HtmlHead";
    import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
    import classNames from 'classnames';
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import { ListAreaService, Commentlist } from "@mock-api/data/datatable";
    import Pagination from "Pagination";
    import { SocketIo } from 'config.js';
    import "react-datepicker/dist/react-datepicker.css";
    import DatePicker from "react-datepicker";
    import moment from "moment";
    import { DEFAULT_USER } from "config.js";

    const ControlsSearch = ({ tableInstance }) => {
        const { setGlobalFilter, state : { globalFilter }, } = tableInstance;

        const [value, setValue] = React.useState(globalFilter);
        const onChange = useAsyncDebounce((val) => {
            setGlobalFilter(val || undefined);
        }, 200);
        return (
            <>
                <Form.Control type="text" value={ value || "" } onChange={(e) => { setValue(e.target.value); onChange(e.target.value); }} placeholder="Search" />
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
                <table style={{ "borderSpacing": "0 calc(var(--card-spacing-xs)/10*7)", "borderCollapse": "separate", "width": "100%" }} className={className} {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, index) => {
                                    return (
                                        <th
                                            key={`th.${index}`}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            className = {classNames(column.headerClassName, {
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
                    <tbody {...getTableBodyProps() } >
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr key={`tr.${i}`} {...row.getRowProps()} >
                                    {row.cells.map((cell, cellIndex) => (
                                        <td key={`td.${cellIndex}`} {...cell.getCellProps()} className={cell.column.cellClassName} style={{
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
                <> </>
            </>
        );
    };
    const Discount = () => {
        const title                         = "Alert history List";
        const description                   = "Ecommerce Discount Page";
        const [isConnected, setIsConnected] = useState(SocketIo.connected);

        const today                      = new Date();
        const [datesearch,SetSearchDate] = useState();
        // Popup Code start from here
        const [show, setShow]            = useState(false);
        const handleClose                = () => setShow(false);
        const [commentList, setCommentList] = useState([]);
        const handleShow = (value) => {
            setShow(true);
            Commentlist({ 
                device_id : value, 
                user_id   : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id 
            }, 
                res => { setCommentList(res.data.result); }
            )
        }
        // Popup Code End from here
        const [itemPerPage, setItemPerpage]  = useState(10);
        const [totalrecord, setTotalrecoard] = useState(1);
        const [totalpage, setTotalpage]      = useState(0);
        const [founddata, setFoundData]      = useState(true);
        const [data, setNewData]             = useState([])
        const [state, setstate]              = React.useState({
            currentPage : 1,
            limit       : itemPerPage
        });
        const { currentPage, limit } = state;

        const handlePagination = (current) => {
            setstate({ ...state, currentPage: current });
            SocketIo.emit('ondatahistory', ({ 
                userid      : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, 
                currentPage : current, 
                limit       : limit, 
                datewise    : "" 
            }));
        };
        React.useEffect(() => {
            setNewData([]);
            if (isConnected) {
                SocketIo.emit('room', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id }));
                
                SocketIo.emit('ondatahistory', ({ 
                    userId      : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, 
                    currentPage : currentPage, 
                    limit       : limit, 
                    datewise    : "" 
                }));
                SocketIo.on('historyList', (result) => {
                    setNewData(result.data);
                    setTotalrecoard(result.totalrecoard);
                    setTotalpage(result.totalpage);
                });
            }
            return () => {
                SocketIo.off('ondatahistory');
                SocketIo.off('historyLists');
                setNewData([]);
            };
        }, [currentPage, limit]);

        const columns = React.useMemo(() => {
            return [
                {
                    Header          : 'Device Id',
                    accessor        : 'deviceid',
                    sortable        : true,
                    headerClassName : 'text-muted text-small text-uppercase w-10 px-3',
                    Cell            : ({ cell }) => {
                        return (
                            <NavLink to={`/device-information/${cell.row.original.deviceid}`}>
                                {cell.row.original.deviceid}
                            </NavLink>
                        );
                    },
                },
                { 
                    Header          : 'Device Name', 
                    accessor        : 'devicename', 
                    sortable        : true, 
                    headerClassName : 'text-muted text-small text-uppercase w-10 px-3', 
                    cellClassName   : 'text-alternate' 
                },
                {
                    Header   : 'Temperature Alert', 
                    accessor : 'temperature',
                    Cell     : (row) => {
                        return (
                            <span>
                            {row.row.original.alertTemp == 1 || row.row.original.alertTemp == '1' ? <span style={{ color: "red" }}> {row.row.original.temperature} &#8451;</span> : <span>   {row.row.original.temperature}  &#8451;</span>}
                            </span>
                        );
                    },
                    sortable        : true, 
                    headerClassName : 'text-muted text-small text-uppercase w-10', 
                    cellClassName   : 'text-alternate'
                },
                {
                    Header: 'Humidity Alert', accessor: 'humidity',
                    Cell: (row) => {
                    return (
                        <span>
                        {row.row.original.alertHumi == 1 || row.row.original.alertHumi == '1' ? <span style={{ color: "red" }}> {row.row.original.humidity}{'%'}</span> : <span> {row.row.original.humidity}{'%'}</span>}
                        </span>

                    );
                    },
                    sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10', cellClassName: 'text-alternate'
                },
                {
                    Header: 'Moisture Alert', accessor: 'moisture',
                    Cell: (row) => {
                    return (
                        <span>
                        {row.row.original.alertMoist == 1 || row.row.original.alertMoist == '1' ? <span style={{ color: "red" }}>{row.row.original.moisture}{'%'}</span> : <span>{row.row.original.moisture}{'%'}</span>}
                        </span>
                    );
                    },
                    sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10', cellClassName: 'text-alternate'
                },
                {
                    Header: 'Fire Alert', accessor: 'fire',
                    Cell: (row) => {
                    return (
                        <>
                        {row.row.original.fire == 1 || row.row.original.fire == '1' ? <span style={{ color: "red" }}>Detected </span> : "Not Detected"}

                        </>


                    );
                    },
                    sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 px-3', cellClassName: 'text-alternate'
                },
                {
                    Header: 'Alert Date Time', accessor: 'update_at', sortable: true,
                    Cell: (row) => (
                    <>
                        <span>{moment(row.row.original.update_at).format('ll')} </span>
                    </>
                    ),
                    headerClassName: 'text-muted text-small text-uppercase w-10 px-3', cellClassName: 'text-alternate'
                },

                {
                    Header: 'Action',
                    accessor: '',
                    sortable: false,
                    Cell: cell => (
                    <button className="text-primary" style={{ backgroundColor: 'transparent', border: 'none' }} value={"Add"} onClick={() => handleShow(cell.row.original.deviceid)}>  {<RemoveRedEyeOutlinedIcon />}
                    </button>
                    ),
                    headerClassName: 'text-muted text-small text-uppercase w-10 px-3',
                    cellClassName: 'text-alternate',
                },
                ];
        }, []);

    const tableInstance = useTable(
        {
            columns, 
            data, 
            initialState : { sortBy : [{ id : 'areaname', desc : true }] }, 
            manualPagination: true 
        }, 
        useGlobalFilter, 
        useSortBy, 
        usePagination, 
    );

  return (
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
        <Col className="d-flex justify-content-between items-align-center">
        <Col sm="5" md="5" lg="3" xxl="2" className="mb-1">
            <div className="d-inline-block float-md-start me-1 search-input-container w-100 border border-separator bg-foreground search-sm">
              <ControlsSearch tableInstance={tableInstance} />
            </div>
          </Col>
          <Col sm="5" md="5" lg="3" xxl="2" className="mb-1">
            <DatePicker
              selected={datesearch}
              placeholderText="Select a date"
              onChange={(e) => {
                 console.log(moment(e).format("YYYY-MM-DD"));
              //   moment(e).format(yyyy/mm/dd)
                 SetSearchDate(e);
                SocketIo.emit('ondatahistory', ({ userId: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id, currentPage: currentPage, limit: limit, datewise:moment(e).format("YYYY-MM-DD") }));
    
              
                // setFieldTouched('date');
              }}
              className="form-control"
              maxDate={today}
              customInput={
                <input
                  type="text"
                  id="validationCustom01"
                  placeholder="First name"
                />
              }
            />
          </Col>
        </Col>
        <Col xs="12" className="overflow-scroll tab-scroll">
          {data.length !== 0 ?
            <Table className="react-table nowrap responsive" tableInstance={tableInstance} />
            :
            <span>No Record</span>
          }
        </Col>

        <Col className="d-flex justify-content-center">
          {

            totalpage > 0 ? <Pagination
              total={totalpage}
              current={currentPage}
              pagination={(crPage) => handlePagination(crPage)}
            /> : null

          }

        </Col>

      </Row>
      <div className="scroll-bar">
        <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
          <Modal.Header closeButton style={{ height: '0px' }}>
            <Modal.Title>Show Comments</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ height: '65vh' }}>
            <div style={{ 
            height: '60vh',
            maxHeight: '100%',
          overflowY:'scroll',
          overflowX:'hidden', }}>
              <div>

                {
                  commentList.length > 0 ? commentList.map((item, index) => {
                    return (
                      <div key={index} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '1rem 0px' }} >
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
                          <span style={{ padding: '5px 20px', borderRadius: '10px' }}>{item.comment_text}</span>
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
            <Button variant="primary" onClick={handleClose} >
              Close
            </Button>
          </div>
        </Modal>
      </div>

    </>
  );
};

export default Discount;