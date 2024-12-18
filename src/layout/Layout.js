import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import Footer from 'layout/footer/Footer';
import Nav from 'layout/nav/Nav';
import RightButtons from 'layout/right-buttons/RightButtons';
import SidebarMenu from 'layout/nav/sidebar-menu/SidebarMenu';
import { DEFAULT_USER, SocketIo } from 'config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RealTimeNotification from "@mock-api/data/notifications";
const Layout = ({ children }) => {
  useLayout();

  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);
   
    // eslint-disable-next-line
  }, [pathname]);
  
  return (
    <>
      <Nav />
      <main>
        <Container>
          <Row className="h-100">
            <SidebarMenu />
            <RealTimeNotification></RealTimeNotification>
            <Col className="h-100" id="contentArea">
              {children}
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
      <RightButtons />
    </>
  );
};
export default React.memo(Layout);