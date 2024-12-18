import React from 'react';
import { Modal } from 'react-bootstrap';
import SearchInput from './SearchInput';

const SearchModal = ({ show, setShow }) => {
  return (
    <Modal id="searchPagesModal" className="modal-under-nav modal-search modal-close-out" size="lg" show={show} onHide={() => setShow(false)}>
      <Modal.Header className="border-0 p-0" />
      <Modal.Body className="ps-5 pe-5 pb-0 border-0">
        <SearchInput show={show} setShow={setShow} />
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
