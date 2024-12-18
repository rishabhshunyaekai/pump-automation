
import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Select from "react-select";
import { Row, Col, Button, Form, Card, } from "react-bootstrap"; //Modal, 
import CsLineIcons from "cs-line-icons/CsLineIcons";
//import moment from "moment";
import { toast } from "react-toastify"
//import * as Yup from "yup";
import { useFormik } from "formik";
import { postRequest } from "../../../@mock-api/data/datatable";
// import { DEFAULT_USER } from "config";

const Createteam = () => {
    // Popup Code start from here
    const history = useHistory();
    const title   = "Add Team";

    const [memberList, setMemberList]       = useState();
    const [memberOptions, setMemberOptions] = useState([]);
    const [areaOptions, setAreaOptions]     = useState([]);

    const initialValues = {
        userid          : sessionStorage.getItem("user_id"),
        team_name       : '', 
        location_id     : '',
        members         : '',
        team_leader     : '',
        team_leader_id  : '',
        team_leader_mob : '',

    };
    React.useEffect(() => {
        
        postRequest(`/memberList`, { userid : sessionStorage.getItem("user_id") }, (res) => {
            setMemberList(res.dataList.data);
            
            let memberOpt = [];
            res.dataList.data.forEach(element => {
                memberOpt.push( { value: element.member_id, label: element.first_name+' '+ element.last_name}, );
            });
            setMemberOptions(memberOpt)
        });
        postRequest(`/areaList`, { userid : sessionStorage.getItem("user_id") }, (res) => {
         
            let areaOpt = [];
            res.result.areaList.forEach(element => {
                areaOpt.push( { value: element.AreaNumber, label: element.AreaName}, );
            });
            setAreaOptions(areaOpt);
        });
    }, []);
    const errorReset = (errors) =>{
        window.scrollTo(1, 1)
        setTimeout(() => {
            errors.team_name        = ''; 
            errors.location_id      = ''; 
            errors.members          = ''; 
            errors.team_leader      = ''; 
            errors.team_leader_id   = ''; 
            errors.team_leader_mob  = ''; 
            
            formik.setTouched({}, false);
        }, 5000);
    }
    const showError = (key, msg) =>{
        errors[key]  = msg;
    }
    const onSubmit = (values) => {

        let errrorVal = 0 ;
        const var_obj = {
            team_name       : 'Team name is required',
            location_id     : 'Please select location',
            members         : 'Please select members',
            team_leader     : 'Please select team leader',
            team_leader_id  : 'Team Leader Email is required',
            team_leader_mob : 'Team Leader mobile is required',
        }
        for (const prop in var_obj) {
            if(values[prop] == ''){
                
                showError(prop, var_obj[prop]);
                errrorVal++;
            }
        }
        if(errrorVal > 0){
            errorReset(errors);
            return false ;
        }
        postRequest(`/add-team`, values, (result) => {
            (result.success == true) ? toast.success(result.message) : toast.error(result.message);
            if (result.success == true) {
                formik.resetForm();
                setTimeout(() => {
                    history.push('/team/team_list');
                }, 3000);
            }
        });
        
    };
    const back = () => {
        history.push('/team/team_list');
    }
    const formik = useFormik({ initialValues, onSubmit }); //validationSchema,
    const { handleSubmit, handleChange, values, touched, errors } = formik;
    let index = 0;
    return (
        <>
            <div className="page-title-container">
                <Row className="g-0">
                    {/* Title Start */}
                    <Col className="col-auto mb-3 mb-sm-0 me-auto">
                        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                            <CsLineIcons icon="chevron-left" size="13" />
                            <span className="align-middle text-small ms-1">Dashboard</span>
                        </NavLink>
                        <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }} >
                            {title}
                        </h1>
                    </Col>
                    {/* Title End */}
                </Row>
            </div>
            <Row>
                <Col className="col-lg">
                    <Card className="mb-5" style={{ height : "auto", position : "relative", top : "0rem", paddingTop : "0rem", width : "100%", margin : "auto", }} >
                        <Card.Body>
                            <h1>Create Team</h1>
                            <hr style={{ width: "100%", opacity: "0.2" }} />
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3 pt-5 pb-5">
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label>Team Name</Form.Label>
                                        <div className="">
                                            <Form.Control type="text" placeholder="Enter the team name" name="team_name" value={values.team_name} onChange={handleChange} />
                                            {errors.team_name && touched.team_name && <div className="d-block invalid-tooltip">{errors.team_name}</div>}
                                        </div>
                                    </Col>
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label style={{ marginLeft: "5px", fontSize: "0.8rem", fontFamily: "inherit", }}>
                                            Location Name
                                        </Form.Label>
                                        <div>
                                            <Select className="react-select-container" name="location_id" classNamePrefix="react-select" options={areaOptions} onChange={(val) => {
                                                formik.setFieldValue("location_id", val.value);
                                            }} />
                                            {errors.location_id && touched.location_id && (
                                                <div className="d-block invalid-tooltip">
                                                    {errors.location_id}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label style={{ marginLeft: "5px", fontSize: "0.8rem", fontFamily: "inherit",}} >
                                            Add Member
                                        </Form.Label>
                                        <div>
                                            <Select className="react-select-container" name="add_member" classNamePrefix="react-select" options= {memberOptions} isMulti closeMenuOnSelect={false} onChange={(val) => {
                                                formik.setFieldValue("members", val);
                                            }} />
                                            {errors.members && touched.members && (
                                                <div className="d-block invalid-tooltip">
                                                    {errors.members}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label style={{ marginLeft: "5px", fontSize: "0.8rem", fontFamily: "inherit",}} >
                                            Team Leader Name
                                        </Form.Label>
                                        <div>
                                            <Select className="react-select-container" classNamePrefix="react-select" options= {memberOptions} 
                                            onChange={(val) => {
                                                index = memberList.findIndex((object) => { // 
                                                    return object.member_id === val.value;
                                                });
                                                formik.setFieldValue("team_leader", val.value);
                                                formik.setFieldValue("team_leader_id", memberList[index].official_email); 
                                                formik.setFieldValue("team_leader_mob", memberList[index].official_mobile_no); 
                                            }}/>
                                            {errors.team_leader && touched.team_leader && (
                                                <div className="d-block invalid-tooltip">
                                                    {errors.team_leader}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label style={{ marginLeft: "5px", fontSize: "0.8rem", fontFamily: "inherit", }} >
                                            Team Leader Official Email ID
                                        </Form.Label>
                                        <div>
                                            <Form.Control type="text" placeholder="Enter the team leader offcial email id" value={values.team_leader_id}
                                            readonly name="team_leader_id" />
                                            {errors.team_leader_id && touched.team_leader_id && (
                                                <div className="d-block invalid-tooltip"> {errors.team_leader_id} </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col lg="4" className="mx-auto">
                                        <Form.Label style={{ marginLeft: "5px", fontSize: "0.8rem", fontFamily: "inherit", }} >
                                            Team Leader Official Mobile No.
                                        </Form.Label>
                                        <div>
                                        <Form.Control type="text" placeholder="Enter the team leader official mobile no" value={values.team_leader_mob} readonly name="team_leader_mob" />
                                        {errors.team_leader_mob && touched.team_leader_mob && (
                                            <div className="d-block invalid-tooltip"> {errors.team_leader_mob} </div>
                                        )}
                                        </div>
                                    </Col>
                                    <Col lg="6" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", }} >
                                        <Button className="btn-icon btn-icon-end" onClick={back} type="reset" >
                                            Cancel <CsLineIcons icon="chevron-right" />
                                        </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button className="btn-icon btn-icon-end" variant="primary" type="submit">
                                            Submit <CsLineIcons icon="chevron-right" />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    ) 
};
export default Createteam;



