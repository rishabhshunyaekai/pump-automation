import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Row, Col, Button, Modal } from "react-bootstrap";
import { useTable, useGlobalFilter, useSortBy, useAsyncDebounce, usePagination } from 'react-table';
import classNames from 'classnames';
import '../configure/parameters/ProductDetails.css';


const Table = ({ tableInstance, className }) => {
  const { getTableProps, headerGroups, rows, getTableBodyProps, prepareRow, state, page, } = tableInstance;
  return (
    <>
      <table style={{ "borderSpacing": "0 calc(var(--card-spacing-xs)/10*7)", "borderCollapse": "separate" }} className={className} {...getTableProps()}>
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

      </>
    </>
  );
};

const RecentHistory = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let data = props.data

  const columns = React.useMemo(() => {

    return [
      {
        Header: 'Device ID', accessor: 'deviceid', sortable: true,
        headerClassName: 'text-muted text-small text-uppercase w-8 p-4', Cell: (cell) => {
          return (
            <>
              <NavLink to={`/device-information/${cell.row.original.deviceid}`}>
                {cell.row.original.deviceid}
              </NavLink>
            </>
          );
        },
      },

      { Header: 'Device Name', accessor: 'devicename', sortable: false, headerClassName: 'text-muted text-small text-uppercase w-8 px-2 ', cellClassName: 'text-alternate' },

      { Header: 'Temperature Alert', accessor: 'temperature', 
      Cell: (row) => {
        return (

          <span>
            {row.row.original.count_temp == 1 || row.row.original.count_temp == '1' ? <span style={{ color: "red" }}> {row.row.original.temperature} &#8451;</span> : <span>   {row.row.original.temperature}  &#8451;</span>}
          </span>
        );
      },
      sortable: false, headerClassName: 'text-muted text-small text-uppercase w-8 px-2', cellClassName: 'text-alternate' },

      { Header: 'Humidity Alert', accessor: 'humidity', 
      Cell: (row) => {
        return (
          <span>
            {row.row.original.count_humi == 1 || row.row.original.count_humi == '1' ? <span style={{ color: "red" }}> {row.row.original.humidity}{'%'}</span> : <span> {row.row.original.humidity}{'%'}</span>}
          </span>

        );
      },
      sortable: false, headerClassName: 'text-muted text-small text-uppercase w-8 ', cellClassName: 'text-alternate', },

      { Header: 'Moisture Alert', accessor: 'moisture',
      Cell: (row) => {
        return (
          <span>
            {row.row.original.count_moist == 1 || row.row.original.count_moist == '1' ? <span style={{ color: "red" }}>{row.row.original.moisture}{'%'}</span> : <span>{row.row.original.moisture}{'%'}</span>}
          </span>
        );
      },
      sortable: false, headerClassName: 'text-muted text-small text-uppercase w-8 ', cellClassName: 'text-alternate', },

      { Header: 'Fire Alert', accessor: 'fire',
      Cell: (row) => {
        return (
          <>
            {row.row.original.fire == 1 || row.row.original.fire == '1' ? <span style={{ color: "red" }}>Detected </span> : "Not Detected"}

          </>


        );
      },
      sortable: false, headerClassName: 'text-muted text-small text-uppercase w-8 px-4', cellClassName: 'text-alternate', },

      {
        Header: 'Action', accessor: 'action', sortable: false, Cell: (cell) => {

          return (<>
            <button style={{ backgroundColor: 'transparent', border: 'none' }} value={"Add"}>
              <NavLink to={`/edit-device/${cell.row.original.deviceid}`}
                className="text-primary"> {<EditIcon />} </NavLink>

            </button>

            <button style={{ backgroundColor: 'transparent', border: 'none' }} value={"Add"}> <NavLink
              to={`/device-information/${cell.row.original.deviceid}`}

              className="text-primary"> {<RemoveRedEyeOutlinedIcon />}  </NavLink></button>

            <button className="text-primary" onClick={handleShow} style={{ backgroundColor: 'transparent', border: 'none' }} value={"Add"}>{<DeleteOutlineOutlinedIcon />}</button>
          </>)
        },
        headerClassName: 'text-muted text-small text-uppercase w-10 px-5', cellClassName: 'text-alternate ',
      },
      ,];
  }, [])

  const tableInstance = useTable({ columns, data, initialState: { sortBy: [{ id: 'name', desc: true }] }, }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>

      <Row className="mb-3">

        <Col className='w-100 overflow-scroll'>
          <Table className="react-table nowrap" tableInstance={tableInstance} />
        </Col>
      </Row>


      {/* Delete popup modal code start from here */}
      <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
        <Modal.Title> <h4 style={{ fontSize: '1.2rem', fontWeight: '600', position: 'relative', top: '1rem', left: '2rem' }}>Delete</h4></Modal.Title>
        <Modal.Body> Are you sure want to delete this!</Modal.Body>
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '0px 1rem', marginBottom: '1rem' }}>
          <Button variant="primary px-5" onClick={handleClose} >
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

export default RecentHistory;
