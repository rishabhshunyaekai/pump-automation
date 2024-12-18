    import React, { useState } from "react";
    import { NavLink } from "react-router-dom";
    //import Select from 'react-select'
    import { Row, Col, Form, Dropdown, Tooltip, OverlayTrigger, } from "react-bootstrap"; //Button, Modal, 
    import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination, } from "react-table";
    import HtmlHead from "components/html-head/HtmlHead";
    import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
    //import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
    import EditIcon from "@mui/icons-material/Edit";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import classNames from "classnames";
    //import { DEFAULT_USER } from "config";
    import "../../configure/parameters/ProductDetails.css";
    import { postRequest} from "@mock-api/data/datatable";   //DeleteDeviceService, ListAreaService,
    import Pagination from "Pagination";

    const ControlsSearch = ({ tableInstance }) => {
        const { setGlobalFilter, state: { globalFilter }, } = tableInstance;
        const [value, setValue] = React.useState(globalFilter);
        const onChange = useAsyncDebounce((val) => {
            setGlobalFilter(val || undefined);
        }, 200);

        return (
            <>
                <Form.Control type="text" value={value || ""} onChange={(e) => { setValue(e.target.value); onChange(e.target.value);
                }} placeholder="Search" />
                {value && value.length > 0 ? (
                    <span className="search-delete-icon"
                        onClick={() => {
                            setValue("");
                            onChange("");
                        }}
                    > <CsLineIcons icon="close" /> </span>
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
                <table style={{ borderSpacing: "0 calc(var(--card-spacing-xs)/10*7)", borderCollapse: "separate", width: "100%", }} className={className} {...getTableProps()} >
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column, index) => {
                                    return (
                                        <th key={`th.${index}`}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
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
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr key={`tr.${i}`} {...row.getRowProps()}>
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
    const Teamlist = () => {
        
        const title       = "Team List";
        const description = "Ecommerce Discount Page";
        
        const [itemPerPage, setItemPerpage] = useState(10);
        const [totalpage, setTotalpage]     = useState(0);
        const [data, setNewData]            = useState([]);
        const [state, setstate]             = React.useState({ currentPage: 1 });
        const { currentPage }               = state;

        const handlePagination = (current) => {
            setstate({ ...state, currentPage: current });
            alldatanew({
                userid : sessionStorage.getItem("user_id"),
                page   : current,
                limit  : itemPerPage,
            });
        };
        const alldatanew = (filter) => {
            postRequest(`/teamList`, filter, (res) => {
                if (res.results.totalrecoard > 0) {
                    setNewData(res.results.dataList);
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

        // const deleteEvent = () => {
        //     DeleteDeviceService({ id: deleteid.id }, (res) => {
        //     alldatanew({
        //         userid: sessionStorage.getItem("user_id"),
        //         page: currentPage,
        //         limit: itemPerPage,
        //     });
        //     setShow1(false);
        //     });
        // };
        const columns = React.useMemo(() => {
            return [
            {
                Header          : "Team ID",
                accessor        : "team_id",
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                Cell            : ({ cell }) => {
                    return (
                        <NavLink to={`/team-information/${cell.row.original.team_id}`}>
                            {cell.row.original.team_id}
                        </NavLink>
                    );
                },
            },
            {
                Header          : "Team Name",
                accessor        : "team_name",
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 px-3",
                cellClassName   : "text-alternate",
            },
            {
                Header   : "Leader Name",
                accessor : "team_leader",
                Cell     : (row) => {
                    return (
                        <span>
                            <span>{row.row.original.team_leader} </span>
                        </span>
                    );
                },
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10",
                cellClassName   : "text-alternate",
            },
            {
                Header   : "Leader Official Email", 
                accessor : "team_leader_id",
                Cell     : (row) => {
                    return (
                        <span>
                            <span>{ row.row.original.team_leader_data.split('__')[0] }</span>
                        </span>
                    );
                },
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 ",
                cellClassName   : "text-alternate",
            },
            {
                Header   : "Leader Mobile Number",
                accessor : "team_leader_mob",
                Cell     : (row) => {
                    return (
                        <span>
                            <span>{ row.row.original.team_leader_data.split('__')[1] }</span>
                        </span>
                    );
                },
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 ",
                cellClassName   : "text-alternate",
            },
            {
                Header   : 'Location Name', 
                accessor : 'location_name',
                Cell     : (row) => {
                    return (
                        <>
                            <span>{ row.row.original.location_name }</span>
                        </>
                    );
                },
                sortable        : true,
                headerClassName : "text-muted text-small text-uppercase w-10 px-4 ",
                cellClassName   : "text-alternate",
            }, {
                Header   : "Action",
                accessor : "",
                sortable : false,
                Cell     : (cell) => {
                    return (
                        <>
                            <button style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                <NavLink to={`/edit-team/${cell.row.original.team_id}`} className="text-primary">
                                    {<EditIcon />}
                                </NavLink>
                            </button>
                            <button style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                <NavLink to={`/team-information/${cell.row.original.team_id}`} className="text-primary">
                                    {<RemoveRedEyeOutlinedIcon />}
                                </NavLink>
                            </button>
                            {/* <button className="text-primary" onClick={() => { handleShow1(cell.row.original); }} 
                                style={{ backgroundColor: "transparent", border: "none" }} value={"Add"} >
                                {<DeleteOutlineOutlinedIcon />}
                            </button> */}
                        </>
                    );
                },
                headerClassName : "text-muted text-small text-uppercase w-10 px-7",
                cellClassName   : "text-alternate",
            }];
        }, []);

        
        const tableInstance = useTable( {
            columns,
            data,
            initialState: {
                sortBy: [{ id: "areaname", desc: true }],
            },
            manualPagination: true,
        }, useGlobalFilter, useSortBy, usePagination );

        return (
            <>
                <HtmlHead title={title} description={description} />
                <div className="page-title-container">
                    <Row className="g-0">
                        <Col className="col-auto mb-3 mb-sm-0 me-auto">
                            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                                <CsLineIcons icon="chevron-left" size="13" />
                                <span className="align-middle text-small ms-1">Dashboard</span>
                            </NavLink>
                            <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
                            {title}
                            </h1>
                        </Col>
                    </Row>
                </div>
                <Row className="mb-3">
                    <Col md="5" lg="3" xxl="2" className="mb-1">
                        <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                            <ControlsSearch tableInstance={tableInstance} />
                            <span className="search-magnifier-icon">
                                <CsLineIcons icon="search" />
                            </span>
                        </div>
                    </Col>
                    <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
                        <Dropdown align={{ xs: "end" }} className="d-inline-block ms-1"
                            onSelect={(e) => {
                                setItemPerpage(Number(e));
                                setstate({ ...state, currentPage: 1 });
                                alldatanew({
                                    userid: sessionStorage.getItem("user_id") ,
                                    page: 1,
                                    limit: e,
                                });
                            }}
                        >
                            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
                                <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13" >
                                    {itemPerPage} Items 
                                </Dropdown.Toggle>
                            </OverlayTrigger>
                            <Dropdown.Menu className="shadow dropdown-menu-end">
                            {[10, 20, 50].map((itemPerPage1) => (
                                <Dropdown.Item key={itemPerPage1} eventKey={itemPerPage1} value={itemPerPage1}>
                                    {itemPerPage1} Items
                                </Dropdown.Item>
                            ))}
                            </Dropdown.Menu>
                        </Dropdown>
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
                <div className="d-flex justify-content-center mt-5">
                    { totalpage > 0 ? (
                        <Pagination total={totalpage} current={currentPage} pagination={(crPage) => handlePagination(crPage)} />
                    ) : null }
                </div>
                {/* <Modal size="sm" show={show1} onHide={handleClose1}>
                    <Modal.Header style={{ padding: 16 }}>
                    <Modal.Title >Delete Operation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: 16 }}>Are you sure you want to delete this device?</Modal.Body>
                    <Modal.Footer style={{ padding: 6 }}>
                    <Button variant="secondary" onClick={handleClose1}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={deleteEvent}>
                        Yes
                    </Button>
                    </Modal.Footer>
                </Modal> */}
            </>
        );
    };
    export default Teamlist;
