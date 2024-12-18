import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Form,
  Modal,
  Dropdown,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import HtmlHead from "components/html-head/HtmlHead";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import classNames from "classnames";
import "../../configure/parameters/ProductDetails.css";
import { ListAreaService } from "@mock-api/data/datatable";
import Pagination from "../../../Pagination";
import { DEFAULT_USER } from "config";

const ControlsSearch = ({ tableInstance }) => {
  const {
    setGlobalFilter,
    state: { globalFilter },
  } = tableInstance;

  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <>
      <Form.Control
        type="text"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search"
      />
      {value && value.length > 0 ? (
        <span
          className="search-delete-icon"
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
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page
  } = tableInstance;
  return (
    <>
      <table
        style={{
          borderSpacing: "0 calc(var(--card-spacing-xs)/10*7)",
          borderCollapse: "separate",
          width: "100%",
        }}
        className={className}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, headerIndex) => (
            <tr
              key={`header${headerIndex}`}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    key={`th.${index}`}
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
        <tbody {...getTableBodyProps()} style={{ fontSize: "13px" }}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={`tr.${i}`} {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`td.${cellIndex}`}
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
      <>
        <div className="d-flex justify-content-center mt-5"></div>
      </>
    </>
  );
};

const AreaList = () => {
  // Popup Code start from here
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Popup Code End from here

  const [itemPerPage, setItemPerpage] = useState(10);
  const [totalrecord, setTotalrecoard] = useState(1);
  const [totalpage, setTotalpage] = useState(0);
  const [founddata, setFoundData] = useState(true);
  const [data, setNewData] = React.useState([]);
  const [state, setstate] = React.useState({
    currentPage: 1,
  });
  const { currentPage } = state;

  const handlePagination = (current) => {
    setstate({ ...state, currentPage: current });
    alldatanew({
      userid: DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
      page: current,
      limit: itemPerPage,
    });
  };

  const alldatanew = (filter) => {
    ListAreaService(filter, (res) => {
      if (res.data.results.totalrecoard > 0) {
        setFoundData(true);
        setTotalrecoard(res.data.results.totalrecoard);
        setTotalpage(res.data.results.totalpage);
        setNewData(res.data.results.areaList);
      } else {
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


  // parent to child data send

  const title = "Area List";
  const description = "Ecommerce Discount Page";
  const columns = React.useMemo(() => {
    return [
      {
        Header: "Area ID",
        accessor: "AreaNumber",
        sortable: false,
        headerClassName:
          "text-muted text-small text-uppercase w-10 px-4 overflow-x",
        Cell: ({ cell }) => {
          return (
            <>
              <a
                className="list-item-heading body"
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <NavLink to={"/view_map_page/" + cell.row.values.AreaNumber}>{cell.value}</NavLink>
              </a>
            </>
          );
        },
      },

      {
        Header: "Area Name",
        accessor: "AreaName",
        sortable: true,
        headerClassName: "text-muted text-small text-uppercase w-10 px-3",
        cellClassName: "text-alternate",
      },

      {
        Header: "No. of Devices",
        accessor: "totalDevice",
        sortable: true,
        headerClassName: "text-muted text-small text-uppercase w-10",
        cellClassName: "text-alternate",
      },

      {
        Header: "Active Devices",
        accessor: "totalActive",
        sortable: true,
        headerClassName: "text-muted text-small text-uppercase w-10",
        cellClassName: "text-alternate",
      },

      {
        Header: "InActive Devices",
        accessor: "totalDeactive",
        sortable: true,
        headerClassName: "text-muted text-small text-uppercase w-10 ",
        cellClassName: "text-alternate",
      },

      {
        Header: "Action",
        accessor: "",
        sortable: false,
        Cell: (cell) => {
          return (
            <>
              <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back text-primary"
                to={"/view_map_page/" + cell.row.values.AreaNumber}
              >
                {<RemoveRedEyeOutlinedIcon />}
              </NavLink>
            </>
          );
        },
        headerClassName: "text-muted text-small text-uppercase w-10 px-3",
        cellClassName: "text-alternate",
      },
      ,
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
    usePagination
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

          {/* Top Buttons Start */}

          {/* Top Buttons End */}
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
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>
          {/* Search End */}
        </Col>
        <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
          {/* Export Dropdown End */}

          {/* Length Start */}
          <Dropdown
            align={{ xs: "end" }}
            className="d-inline-block ms-1"
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

      <Row>
        <Col xs="12" className="overflow-scroll">
          {data.length !== 0 ?
            <Table className="react-table nowrap" tableInstance={tableInstance} />
            :
            <span>No Record</span>
          }
        </Col>
        <Col className="d-flex justify-content-center">
          {totalpage > 0 ? (
            <Pagination
              total={totalpage}
              current={currentPage}
              pagination={(crPage) => handlePagination(crPage)}
            />
          ) : null}
        </Col>
      </Row>

      {/* Delete popup modal code start from here */}
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        onHide={handleClose}
      >
        <Modal.Title>
          {" "}
          <h4
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              position: "relative",
              top: "1rem",
              left: "2rem",
            }}
          >
            Delete
          </h4>
        </Modal.Title>
        <Modal.Body> Are you sure want to delete this!</Modal.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            padding: "0px 1rem",
            marginBottom: "1rem",
          }}
        >
          <Button variant="primary px-5" onClick={handleClose}>
            No
          </Button>
          &nbsp;&nbsp;
          <Button variant="primary px-5" onClick={handleClose}>
            Yes
          </Button>
        </div>
      </Modal>
      {/* Delete popup modal code end from here */}
    </>
  );
};

export default AreaList;
