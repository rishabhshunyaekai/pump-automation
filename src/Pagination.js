import React from "react";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const Pagination = (props) => {
    const handlePagination = (current) => {
        props.pagination(current);
    };
    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <a
                            className={`page-link ${props.current === 1 ? "link-disable" : props.current > 1 ? "" : ""
                                }`}
                                // style={{color: '#24A6F6'}}
                            // href="#"
                            onClick={() => handlePagination(props.current - 1)}
                        >
                            <KeyboardDoubleArrowLeftIcon />
                        </a>
                    </li>
                    {props.total < 7 ? (
                        <>
                            {Array.apply(0, Array(props.total)).map((arr, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${props.current === i + 1 ? "active" : ""
                                        }`}
                                >
                                    <a
                                        className="page-link"
                                        // style={{backgroundColor: '#24A6F6'}}
                                        // href="#"
                                        onClick={() => handlePagination(i + 1)}
                                    >
                                        {i + 1}
                                    </a>
                                </li>
                            ))}
                        </>
                    ) : props.current % 5 >= 0 &&
                        props.current > 4 &&
                        props.current + 2 < props.total ? (
                        <>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(1)}
                                >
                                    1
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link disabled" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.current - 1)}
                                >
                                    {props.current - 1}
                                </a>
                            </li>
                            <li className="page-item active">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.current)}
                                >
                                    {props.current}
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.current + 1)}
                                >
                                    {props.current + 1}
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link disabled" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    ) : props.current % 5 >= 0 &&
                        props.current > 4 &&
                        props.current + 2 >= props.total ? (
                        <>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(1)}
                                >
                                    1
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link disabled" href="#">
                                    ...
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 3 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.total - 3)}
                                >
                                    {props.total - 3}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 2 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePagination(props.total - 2)}
                                >
                                    {props.total - 2}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total - 1 ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.total - 1)}
                                >
                                    {props.total - 1}
                                </a>
                            </li>
                            <li
                                className={`page-item ${props.current === props.total ? "active" : ""
                                    }`}
                            >
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            {Array.apply(0, Array(5)).map((arr, i) => (
                                <li
                                    className={`page-item ${props.current === i + 1 ? "active" : ""
                                        }`}
                                    key={i}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        onClick={() => handlePagination(i + 1)}
                                    >
                                        {i + 1}
                                    </a>
                                </li>
                            ))}
                            <li className="page-item">
                                <a className="page-link disabled" href="#">
                                    ...
                                </a>
                            </li>
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    // href="#"
                                    onClick={() => handlePagination(props.total)}
                                >
                                    {props.total}
                                </a>
                            </li>
                        </>
                    )}
                    <li className="page-item">
                        <a
                            className={`page-link ${props.current === props.total
                                ? "link-disable"
                                : props.current < props.total
                                    ? ""
                                    : ""
                                }`}
                            // href="#"
                            // style={{color: '#24A6F6'}}
                            onClick={() => handlePagination(props.current + 1)}
                        >
                            <KeyboardDoubleArrowRightIcon />
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
