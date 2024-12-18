    import React, { useState } from "react";
    import { NavLink } from "react-router-dom";

    // import material ui
    import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
    import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
    import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
    import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
    import PhonePausedOutlinedIcon from '@mui/icons-material/PhonePausedOutlined';
    import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
    import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
    import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
    import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
    import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
    import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
    import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
    import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
    import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
    //import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
    import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
    import { Row, Col, Card } from "react-bootstrap";
    import { useParams } from "react-router";
    import HtmlHead from "components/html-head/HtmlHead";
    import CsLineIcons from "cs-line-icons/CsLineIcons";

    import moment from "moment";
    import { postRequest } from "@mock-api/data/datatable";

    const MemberInfo = () => {
        let { id } = useParams();
        
        const title                 = "Member Information";
        const description           = "Ecommerce Customer Detail Page";
        const [details, SetDetails] = useState({});
        const [historyData, SetHistoryData] = useState([]);

        const img_arr = ['jpg', 'jpeg', 'png'] ;
        const doc_arr = ['doc', 'docx'] ;
        const [passportEXT, SetPassportEXT]   = useState({});
        const [emiratesEXT, SetEmiratesEXT]   = useState({});
        const [visaEXT, SetVisaEXT]           = useState({});
        const [insuranceEXT, SetInsuranceEXT] = useState({});

        const downloadFiles = (e) => {

            let files = e.target.getAttribute('files') ;
            let urls = files.split('*');
            let name = e.target.getAttribute('name')
            var link = document.createElement('a');
            link.setAttribute('download', name);
            link.style.display = 'none';
            document.body.appendChild(link);

            for (var i = 0; i < urls.length; i++) {
                link.setAttribute('href', "http://localhost:8080/uploads/member_files/"+urls[i]);
                link.setAttribute('target', "_blank");
                link.click();
                // console.log('link', link);
            }
            document.body.removeChild(link);
        }

        React.useEffect(() => {
            postRequest(`/memberDetails`, { memberId : id }, (res) => {
               
                SetDetails(res.result);

                let passportArr  = res.result.passport.split('*');
                let emiratesArr  = res.result.emirates_id.split('*');
                let visaArr      = res.result.visa_file.split('*');
                let insuranceArr = res.result.insurance_file.split('*');

                SetPassportEXT( passportArr[0].split('.').pop() ) ; 
                SetEmiratesEXT( emiratesArr[0].split('.').pop() ) ;
                SetVisaEXT( visaArr[0].split('.').pop() ) ;
                SetInsuranceEXT( insuranceArr[0].split('.').pop() ) ;
            });
            postRequest(`/memberAllotedHistory`, { memberId : id }, (res) => {
               
                console.log('asdasd', res.result); 
                SetHistoryData(res.result);
            });
            //
        }, []);
        var passportBTN = (img_arr.indexOf(passportEXT) > -1) ? <PhotoSizeSelectActualOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : <PictureAsPdfOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> ;

        passportBTN = (doc_arr.indexOf(passportEXT) > -1) ? 
            <FileCopyOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : passportBTN ;

        var emratesBTN = (img_arr.indexOf(emiratesEXT) > -1) ? <PhotoSizeSelectActualOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : <PictureAsPdfOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> ;

        emratesBTN = (doc_arr.indexOf(emiratesEXT) > -1) ? 
            <FileCopyOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : emratesBTN ;

        var visaBTN = (img_arr.indexOf(visaEXT) > -1) ? <PhotoSizeSelectActualOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : <PictureAsPdfOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> ;

        visaBTN = (doc_arr.indexOf(visaEXT) > -1) ? 
            <FileCopyOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : visaBTN ;

        var insuranceBTN = (img_arr.indexOf(insuranceEXT) > -1) ? <PhotoSizeSelectActualOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : <PictureAsPdfOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> ;

        insuranceBTN = (doc_arr.indexOf(insuranceEXT) > -1) ? 
                <FileCopyOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> : insuranceBTN ;

        return (
            <>
                <HtmlHead title={title} description={description} />
                <div className="page-title-container">
                    <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                        <CsLineIcons icon="chevron-left" size="13" />
                        <span className="align-middle text-small ms-1">Dashboard</span>
                    </NavLink>
                    <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }}>
                        {title}
                    </h1>
                </div>
                <Row>
                    <Col xl="4">
                        <Card className="mb-5">
                            <Card.Body className="mb-n5">
                                <div className="d-flex align-items-center flex-column">
                                    <div className=" d-flex align-items-center flex-column">
                                        <div className="h5 mb-1">{details.member_id} </div>
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <p className="text-small text-muted mb-2">Personal Details</p>
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
                                                        Member Name
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.first_name} &nbsp;{details.last_name}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <EmailOutlinedIcon icon="cart" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25"> Personal Email ID </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center"> {details.email} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <LocalPhoneOutlinedIcon icon="cart" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Personal Mobile No
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {details.mobile_no}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="mb-5">
                                    <p className="text-small text-muted mb-2">Official Details</p>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <MarkEmailUnreadOutlinedIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Official Email ID
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center"> {details.official_email} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <PhonePausedOutlinedIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Official Mobile No
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center"> {details.official_mobile_no} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <AssuredWorkloadOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25"> Work Type </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center"> {details.work_type} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <GroupAddOutlinedIcon icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25"> Team Name </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center"> {details.team_name} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <AddCardOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Passport Expiry Date
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {moment(details.passport_expiry_date).format("ll")}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <CardGiftcardOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Emirates Expiry Date
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {moment(details.emirates_expiry_date).format("ll")}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <CreditCardOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col> <div className="sh-5 d-flex align-items-center lh-1-25"> Visa Expiry Date </div> </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">{moment(details.visa_expiry_date).format("ll")} </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="g-0 align-items-center mb-2">
                                        <Col xs="auto">
                                            <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                                                <CreditScoreOutlinedIcon from icon="credit-card" className="text-primary" />
                                            </div>
                                        </Col>

                                        <Col className="ps-3">
                                            <Row className="g-0">
                                                <Col>
                                                    <div className="sh-5 d-flex align-items-center lh-1-25">
                                                        Insurance Expiry Date
                                                    </div>
                                                </Col>
                                                <Col xs="auto">
                                                    <div className="sh-5 d-flex align-items-center">
                                                        {moment(details.insurance_expiry_date).format("ll")}
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
                        {/* Status Start */}
                        <h2 className="small-title">Uploaded Documents</h2>
                        <Row className="g-2 mb-5">
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                                        {/* <PictureAsPdfOutlinedIcon style={{ width: "2.5rem", height: "4.5rem" }} className="text-primary" /> */}
                                        {passportBTN}
                                        <div className="d-flex flex-column align-items-end">
                                            <div className="d-flex align-items-center justify-content-center text-white border border-info rounded-3 bg-primary" style={{ width: "106px", marginTop: "1.4rem", cursor : 'pointer' }} files={details.passport} name="passport" onClick={downloadFiles}>
                                                <FileDownloadOutlinedIcon className="text-white me-1"  /> Download
                                            </div>
                                            <h6 className="mt-2"> Passport </h6>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                                        {emratesBTN}
                                        <div className="d-flex flex-column align-items-end">
                                            <div className="d-flex align-items-center justify-content-center text-white border border-info rounded-3 bg-primary" style={{ width: "106px", marginTop: "1.4rem", cursor : 'pointer'  }} files={details.emirates_id} name="emirates_id" onClick={downloadFiles} >
                                                <FileDownloadOutlinedIcon className="text-white me-1" /> Download
                                            </div>
                                            <h6 className="mt-2"> Emirates </h6>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                                        {visaBTN}
                                        <div className="d-flex flex-column align-items-end">
                                            <div className="d-flex align-items-center justify-content-center text-white border border-info rounded-3 bg-primary" style={{ width: "106px", marginTop: "1.4rem", cursor : 'pointer'  }} files={details.visa_file} name="visa_file" onClick={downloadFiles} >
                                                <FileDownloadOutlinedIcon className="text-white me-1" /> Download
                                            </div>
                                            <h6 className="mt-2"> Visa </h6>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card className="sh-13 sh-lg-15 sh-xl-14">
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
                                        {insuranceBTN}
                                        <div className="d-flex flex-column align-items-end">
                                            <div className="d-flex align-items-center justify-content-center text-white border border-info rounded-3 bg-primary" style={{ width: "106px", marginTop: "1.4rem", cursor : 'pointer'  }} files={details.insurance_file} name="insurance_file" onClick={downloadFiles} >
                                                <FileDownloadOutlinedIcon className="text-white me-1" /> Download
                                            </div>
                                            <h6 className="mt-2"> Insurance </h6>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between"> <h2 className="small-title">Allotted History</h2> </div>
                        {historyData.length > 0  ? (
                            <>
                                <Row className="g-0  align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
                                    <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                        <div className="text-muted text-medium cursor-pointer"> Member ID </div>
                                    </Col>
                                    <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                        <div className="text-muted text-medium cursor-pointer"> Member Name </div>
                                    </Col>
                                    <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                        <div className="text-muted text-medium cursor-pointer "> Previous Team Name </div>
                                    </Col>
                                    <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                        <div className="text-muted text-medium cursor-pointer"> Current Team Name </div>
                                    </Col>
                                    <Col lg="2" className="d-flex flex-column pe-1 justify-content-center" >
                                        <div className="text-muted text-medium cursor-pointer"> Location </div>
                                    </Col>
                                    <Col lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex" >
                                        <div className="text-muted text-medium cursor-pointer"> Date & Time </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mb-5">
                                            {historyData.map((item, index) => {
                                                return (
                                                    <Card className="mb-2" key={index}>
                                                        <Card.Body className="sh-16 sh-md-8 py-0">
                                                            <Row className="g-0 h-100 align-content-center"
                                                                style={{ marginLeft: "1rem" }}
                                                            >
                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                                    <div className="text-alternate">
                                                                        <span className="text-medium"> {item.member_id} </span>
                                                                    </div>
                                                                </Col>
                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                                    <div className="text-alternate">
                                                                        {item.member_name}
                                                                    </div>
                                                                </Col>

                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                                    <div className="text-alternate">
                                                                        {item.prev_team_name}
                                                                    </div>
                                                                </Col>

                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                                    <div className="text-alternate">
                                                                        {item.cur_team_name}
                                                                    </div>
                                                                </Col>
                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0" >
                                                                    <div className="text-alternate">
                                                                        {item.location_name}
                                                                    </div>
                                                                </Col>
                                                                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100" >
                                                                    {moment(item.created_at).format("llll")}
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <Row>
                                <Col>No Data Found</Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </>
        ) 
    };  

export default MemberInfo;
