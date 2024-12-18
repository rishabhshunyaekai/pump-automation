import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Form,
  Card,
  Pagination,
  Modal,
  Dropdown,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination } from 'react-table';
//import { Col, Row } from 'react-bootstrap';
import HtmlHead from "components/html-head/HtmlHead";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import classNames from 'classnames';
import { Pages } from "@mui/icons-material";
import '../configure/parameters/ProductDetails.css';

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
      <Form.Control type="text"
        value={value || ''}
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
            setValue('');
            onChange('');
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
  const { getTableProps, headerGroups, rows, getTableBodyProps, prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    page,
    gotoPage,
    pageCount,
    setPageSize
  } = tableInstance;
  const { pageIndex, pageSize } = state;
  return (

    <>
      <table style={{ "borderSpacing": "0 calc(var(--card-spacing-xs)/10*7)", "borderCollapse": "separate", "width": "100%", }} className={className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerIndex) => (
            <tr key={`header${headerIndex}`} {...headerGroup.getHeaderGroupProps()}>
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
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} style={{ border: '2px solid red', fontSize: '1rem' }}>
          {page.map((row, i) => {

            prepareRow(row);
            return (
              <tr key={`tr.${i}`} {...row.getRowProps()}>

                {row.cells.map((cell, cellIndex) => (
                  <td key={`td.${cellIndex}`} {...cell.getCellProps()} className={cell.column.cellClassName} style={{
                    "border": "1px solid transparent",
                    "height": "50px",
                    "borderWsidth": "1px 0",
                    "background": "var(--foreground)",
                    "paddingLeft": "var(--card-spacing-sm)",
                    "paddingRight": "var(--card-spacing-sm)",
                    "paddingTop": "0.25rem",
                    "paddingBottom": "0.25rem",
                  }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <>
        {/* <div style={{ width:'100%', display:'flex', justifyContent:'center', alignItems:'center', padding:'10px 0px'}}>
        <button className="page-btn btn btn-outline-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button className="page-btn btn btn-outline-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>{" "}
        <button className="page-btn btn btn-outline-primary" onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>{" "}
        <button className="page-btn btn btn-outline-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span  style={{marginLeft:'5px'}}> 
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span style={{marginright:'5px', marginLeft:'5px'}}>
      
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px", height:'23px', margin:'0px 2px', border: '0.5px solid', borderColor:'#1EA8E7', borderRadius:'5px' }}
          />
        </span>{" "}

        <select className="btn btn-outline-primary"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{padding:'2px 15px', borderRadius:'5px', marginTop:'0px'}}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        
      </div>   

      <div className="select-btn">
      <select className="btn btn-outline-primary"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{padding:'2px 15px', borderRadius:'5px', marginTop:'10px'}}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}


        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>
            <Pagination.Item className="shadow" active>
              1
            </Pagination.Item>
            <Pagination.Item className="shadow">2</Pagination.Item>
            <Pagination.Item className="shadow">3</Pagination.Item>
            <Pagination.Next className="shadow">
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      </>
    </>
  );
};

const Invoice = () => {

  const title = "Invoice";
  const description = "Ecommerce Discount Page";

  const columns = React.useMemo(() => {

    return [
      {
        Header: 'Invoice ID', accessor: 'invoice_id', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 p-4', Cell:
          ({ cell }) => { return 202201 },
      },

      { Header: 'Invoice Name', accessor: 'invoice_name', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 px-3', cellClassName: 'text-alternate' },

      { Header: 'Generate Date', accessor: 'generate_date', sortable: true, headerClassName: 'text-muted  text-small text-uppercase w-10 px-4', cellClassName: 'text-alternate' },

      {
        Header: 'Action', accessor: 'action px-5', sortable: false, Cell: (cell) => {
          return (<>
            <button style={{ marginLeft: '-3rem', backgroundColor: 'transparent', border: 'none' }} value={"Add"}> <NavLink to="#"> {<RemoveRedEyeOutlinedIcon className="text-primary" />} </NavLink>
            </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://drive.google.com/file/d/1njTjmeYFXWXFR_bVpliBxv6u68Z27Rle/view?usp=share_link" target="_blank">  <button style={{ backgroundColor: 'transparent', border: 'none' }} ><FileDownloadOutlinedIcon className="text-primary" /></button></a>
          </>)
        },
        headerClassName: 'text-muted text-small text-uppercase w-10 ', cellClassName: 'text-alternate',
      },
      ,];
  }, [])


  const data = React.useMemo(() => {
    return [
      { invoice_id: 202201, invoice_name: 'LevMon', generate_date: '01-Dec-2022', },
      // { device_id: 202202, device_name: 'MobiOne', register_date: '06-jan-2022',   },
      // { device_id: 202203, device_name: 'LevMon', register_date: '01-Mar-2022',   },
      // { device_id: 202204, device_name: 'MobiOne', register_date: '07-July-2022', },
      // { device_id: 202205, device_name: 'LevMon', register_date: '04-Aug-2022',  },
      // { device_id: 202206, device_name: 'MobiOne', register_date: '09-Sep-2022',  },
      // { device_id: 202207, device_name: 'LevMon', register_date: '03-Nov-2022',   },
      // { device_id: 202208, device_name: 'MobiOne', register_date: '02-Dec-2022',  },
      // { device_id: 202209, device_name: 'LevMon', register_date: '07-Dec-2022',  },
      // { device_id: 202210, device_name: 'MobiOne', register_date: '02-Dec-2022', },
      // { device_id: 202211, device_name: 'LevMon', register_date: '01-Dec-2022',  },
      // { device_id: 202212, device_name: 'MobiOne', register_date: '05-Dec-2022', },

    ];
  }, []);

  const tableInstance = useTable({ columns, data, initialState: { sortBy: [{ id: 'name', desc: true }] }, }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
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
            <Form.Control type="text" placeholder="Search" />
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
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13 border-secondary">
                10 Items
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">5 Items</Dropdown.Item>
              <Dropdown.Item href="#">10 Items</Dropdown.Item>
              <Dropdown.Item href="#">20 Items</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      <Row>
        <Col xs="12">
          <Table className="react-table nowrap" tableInstance={tableInstance} />
        </Col>
      </Row>

      {/* <Row className="mb-3">
      <Col sm="12" md="5" lg="3" xxl="2" className="mb-1">
        <div className="d-inline-block float-md-start me-1 search-input-container w-100 border border-separator bg-foreground search-sm">
          <ControlsSearch tableInstance={tableInstance} />
        </div>
      </Col>
      <Col xs="12">
        <Table className="react-table nowrap" tableInstance={tableInstance} />
      </Col>  
    
      </Row>    */}


    </>
  );
};

export default Invoice;
