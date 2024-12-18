import React from "react";

import { Row, Col } from "react-bootstrap";
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import classNames from 'classnames';
import '../configure/parameters/ProductDetails.css';


const Table = ({ tableInstance, className }) => {
  const { getTableProps, headerGroups, rows, getTableBodyProps, prepareRow, state, page, } = tableInstance;
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

const RecentHistory = () => {

  const columns = React.useMemo(() => {

    return [
      {
        Header: 'Device ID', accessor: 'device_id', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 p-4', Cell:
          ({ cell }) => { return 202201 }
      },

      { Header: 'Device Name', accessor: 'device_name', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 px-4 ', cellClassName: 'text-alternate' },

      { Header: 'Temperature Alert', accessor: 'temperature_alert', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 ', cellClassName: 'text-alternate' },

      { Header: 'Humidity Alert', accessor: 'humidity_alert', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 ', cellClassName: 'text-alternate', },

      { Header: 'Moisture Alert', accessor: 'moisture_alert', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 ', cellClassName: 'text-alternate', },

      { Header: 'Fire Alert', accessor: 'fire_alert', sortable: true, headerClassName: 'text-muted text-small text-uppercase w-10 ', cellClassName: 'text-alternate', },
      ,];
  }, [])


  const data = React.useMemo(() => {
    return [
      { device_id: 202201, device_name: 'LevMon', temperature_alert: '66 ℃', humidity_alert: '47%', moisture_alert: '39%', fire_alert: 1 },
      { device_id: 202201, device_name: 'LevMon', temperature_alert: '66 ℃', humidity_alert: '47%', moisture_alert: '39%', fire_alert: 1 },
      { device_id: 202201, device_name: 'LevMon', temperature_alert: '66 ℃', humidity_alert: '47%', moisture_alert: '39%', fire_alert: 1 },
      { device_id: 202201, device_name: 'LevMon', temperature_alert: '66 ℃', humidity_alert: '47%', moisture_alert: '39%', fire_alert: 1 },
    ];
  }, []);

  const tableInstance = useTable({ columns, data, initialState: { sortBy: [{ id: 'name', desc: true }] }, }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>

      <Row className="mb-3">

        <Col xs="12">
          <Table className="react-table nowrap" tableInstance={tableInstance} />
        </Col>
      </Row>
    </>
  );
};

export default RecentHistory;
