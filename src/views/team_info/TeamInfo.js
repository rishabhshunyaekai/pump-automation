    import React, { useState } from "react";
    import { NavLink } from "react-router-dom";

    // import material ui
    import HowToRegIcon from "@mui/icons-material/HowToReg";
    import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
    import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
    import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
    import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
    import { Row, Col, Button, Card } from "react-bootstrap";
    import { useParams } from "react-router";
    import HtmlHead from "components/html-head/HtmlHead";
    import CsLineIcons from "cs-line-icons/CsLineIcons";
    import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
    import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';

    import { postRequest } from "@mock-api/data/datatable";

    const DeviceInfo = () => {
        let { id }                  = useParams();
        const title                 = "Team Information";
        const [details, SetDetails] = useState(0);
        const [teamMembers, SetTeamMembers] = useState([]);

        React.useEffect(() => {
            postRequest(`/teamDetails`, { teamId : id }, (res) => {
                
                let objj = {
                    team_id           : res.result.team_id,
                    team_name         : res.result.team_id,
                    team_leader       : res.result.team_leader,
                    team_leader_email : res.result.team_leader_data.split('__')[0],
                    team_leader_mob   : res.result.team_leader_data.split('__')[1],
                    location_name     : res.result.location_name,
                    member_count      : res.result.member_count,
                    alloted_count     : res.result.alloted_count
                }
                SetDetails(objj);
            });
            postRequest(`/teamAllotedHistory`, { teamId : id }, (res) => {
                
                SetTeamMembers(res.result);
            });
        }, []);
        return  (
            <>
                <HtmlHead title={title} />
                <div className="page-title-container">
                    <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                        <CsLineIcons icon="chevron-left" size="13" />
                        <span className="align-middle text-small ms-1">Dashboard</span>
                    </NavLink>
                    <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
                        {title}
                    </h1>
                </div>
                <Row className="mt-6">
                    <Col xl="4">
                        <Card className="mb-5">
                            <Card.Body className="mb-n5">
                                <div className="d-flex align-items-center flex-column">
                                    <div className=" d-flex align-items-center flex-column">
                                        <div className="h5 mb-1">{details.team_id}</div>
                                    </div>
                                </div>
                                <div>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <GroupWorkOutlinedIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Team Name
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                    {details.team_name }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="mb-5">
                                    {/* <p className="text-small text-muted mb-2">Device Details</p> */}
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <HowToRegIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Leader Name
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.team_leader}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <DraftsOutlinedIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Official Email Id
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.team_leader_email}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <CallOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Official Mobile Number
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.team_leader_mob}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <AppRegistrationIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Location Name
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.location_name}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl="8">
                        <Row className="g-2 mb-5">
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <Card.Body className="h-100 py-3 d-flex align-items-center">
                                        <Row className="g-0 align-items-center">
                                            <Col xs="auto" className="pe-3">
                                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                                    <PeopleAltOutlinedIcon icon="tag" className="text-primary" />
                                                </div>
                                            </Col>
                                            <Col style={{ width: "20rem" }}>
                                                <div style={{ fontSize: "1.5rem", textAlign: "center", }}>
                                                    Total Members
                                                </div>
                                                <div className={`${details.count_temp == 1 ? "text-danger" : "text-primary"} `}
                                                    style={{
                                                        textAlign: "center",
                                                        fontSize: "1.3rem",
                                                        paddingTop: "0.7rem",
                                                    }}
                                                >
                                                    {details.member_count} 
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <Card.Body className="h-100 py-3 d-flex align-items-center">
                                        <Row className="g-0 align-items-center">
                                            <Col xs="auto" className="pe-3">
                                                <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                                    <ShareLocationOutlinedIcon icon="clipboard" className="text-primary" />
                                                </div>
                                            </Col>
                                            <Col style={{ width: "20rem" }}>
                                                <div style={{ fontSize : "1.5rem", textAlign : "center", }}> Allotted Team </div>
                                                <div className={`${details.count_humi == 1 ? "text-danger" : "text-primary"} `}
                                                    style={{
                                                        textAlign  : "center",
                                                        fontSize   : "1.3rem",
                                                        paddingTop : "0.7rem",
                                                    }}
                                                >
                                                    {details.alloted_count} 
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between">
                            <h2 className="small-title">Member List</h2>
                        </div>
                        <Row className="g-0  align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                <div className="text-muted text-medium cursor-pointer"> Member ID </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                <div className="text-muted text-medium cursor-pointer"> Member Name </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                <div className="text-muted text-medium cursor-pointer "> Official Email </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                <div className="text-muted text-medium cursor-pointer"> Official Phone No </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                <div className="text-muted text-medium cursor-pointer"> Work Type </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
                                <div className="text-muted text-medium cursor-pointer"> Previous Team Name </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="mb-5">
                                    {teamMembers.map((item, index) => {
                                        return (
                                            <Card className="mb-2" key={index}>
                                                <Card.Body className="sh-16 sh-md-8 py-0">
                                                    <Row className="g-0 h-100 align-content-center" style={{ marginLeft: "1rem" }}>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.member_id} </span>
                                                            </div>
                                                        </Col>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.member_name} </span>
                                                            </div>
                                                        </Col>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.official_email} </span>
                                                            </div>
                                                        </Col>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.official_mobile_no} </span>
                                                            </div>
                                                        </Col>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.work_type} </span>
                                                            </div>
                                                        </Col>
                                                        <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                            <div className="text-alternate">
                                                                <span className="text-medium"> {item.team_name}</span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        ) ;
    };
    export default DeviceInfo;
