
import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Row, Col, Button, Form, Card, } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import PhoneInput from "react-phone-input-2";
import "../member/create_member/bootstrap.css";
import "../member/create_member/createmember.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DEFAULT_USER } from "config";
// import * as Yup from "yup";
import { useFormik } from "formik";
import { EditMember, postRequest} from "../../@mock-api/data/datatable";
import { toast } from "react-toastify"
import moment from "moment";
import { useParams } from "react-router";

const Createmember = () => {
    let { id } = useParams();
    const title = "Edit Member";
    const history = useHistory()
    
    const [passportExpiry, setPassportExpiry]   = useState('');
    const [emiratesExpiry, setEmiratesExpiry]   = useState('');
    const [visaExpiry, setVisaExpiry]           = useState('');
    const [insuranceExpiry, setInsuranceExpiry] = useState('');

    const [mobile_no, setMobileNo] = useState('');
    const [official_mobile_no, setOfficialMobileNo] = useState('');

    const [passport, setPassport]   = useState('');
    const [emirates, setEmirates]   = useState('');
    const [visaFile, setVisaFile]   = useState('');
    const [insurance, setInsurance] = useState('');

    const [passportName, setPassportName]   = useState();
    const [emiratesName, setEmiratesName]   = useState('');
    const [visaFileName, setVisaFileName]   = useState('');
    const [insuranceName, setInsuranceName] = useState('');


    const initialValues = {
        userid                : DEFAULT_USER.id == null ? sessionStorage.getItem("user_id") : DEFAULT_USER.id,
        first_name            : '',
        last_name             : '',
        email                 : '',
        mobile_no             : '',
        official_email        : '',
        official_mobile_no    : '',
        designation           : '',
        work_type             : '',
        passport_expiry_date  : '',
        emirates_expiry_date  : '',
        visa_expiry_date      : '',
        insurance_expiry_date : '',
        passport              : '',
        emirates              : '',
        visa_file             : '',
        insurance             : '',
    }
    const errorReset = (errors) =>{
        window.scrollTo(1, 1)
        setTimeout(() => {
            errors.first_name            = ''; 
            errors.last_name             = ''; 
            errors.email                 = ''; 
            errors.mobile_no             = ''; 
            errors.official_email        = ''; 
            errors.official_mobile_no    = ''; 
            errors.designation           = '';
            errors.work_type             = '';
            errors.passport_expiry_date  = '';
            errors.emirates_expiry_date  = '';
            errors.visa_expiry_date      = '';
            errors.insurance_expiry_date = '';
            errors.passport              = '';
            errors.emirates              = '';
            errors.visa_file             = '';
            errors.insurance             = '';
            
            formik.setTouched({}, false);
        }, 5000);
    }
    const showError = (key, msg) =>{
        
        errors[key]  = msg;
    }
    const onSubmit = (values) => {
        
        let errrorVal = 0 ;
        const var_obj = {
            first_name     : 'First name is required',
            last_name      : 'Last name is required',
            email          : 'Email is required',
            official_email : 'Official Email is required',
            designation    : 'Designation is required',
            work_type      : 'Work type is required',
        }
        for (const prop in var_obj) {
            if(values[prop] == ''){
                
                showError(prop, var_obj[prop]);
                errrorVal++;
            }
        }
        if(mobile_no == ''){
            showError('mobile_no', 'Mobile no is required');
            errrorVal++;
        }
        if(official_mobile_no == ''){
            showError('official_mobile_no', 'Offcial Mobile no is required');
            errrorVal++;
        }
        if(passportExpiry == ''){
            showError('passport_expiry_date', 'Passport expiry date is required');
            errrorVal++;
        }
        if(emiratesExpiry == ''){
            showError('emirates_expiry_date', 'Emirates expiry date is required');
            errrorVal++;
        }
        if(visaExpiry == ''){
            showError('visa_expiry_date', 'Visa expiry date is required');
            errrorVal++;
        }
        if(insuranceExpiry == ''){
            showError('insurance_expiry_date', 'Insurance expiry date is required');
            errrorVal++;
        }
        if(errrorVal > 0){
            errorReset(errors);
            return false ;
        }
        var form_data = new FormData(); 
        for( var i = 0; i < passport.length; i++){
            form_data.append('passport', passport[i]);
        }
        for( var i = 0; i < emirates.length; i++){
            form_data.append('emirates', emirates[i]);
        }
        for( var i = 0; i < visaFile.length; i++){
            form_data.append('visa_file', visaFile[i]);
        }
        for( var i = 0; i < insurance.length; i++){
            form_data.append('insurance', insurance[i]);
        }
        form_data.append('userid', values.userid);
        form_data.append('member_id', id);
        form_data.append('first_name', values.first_name);
        form_data.append('last_name', values.last_name);
        form_data.append('email', values.email);
        form_data.append('mobile_no', mobile_no);
        form_data.append('official_email', values.official_email);
        form_data.append('official_mobile_no', official_mobile_no);
        form_data.append('designation', values.designation);
        form_data.append('work_type', values.work_type);
        form_data.append('passport_expiry_date', moment(passportExpiry).format("YYYY-MM-DD"));
        form_data.append('emirates_expiry_date', moment(emiratesExpiry).format("YYYY-MM-DD"));
        form_data.append('visa_expiry_date', moment(visaExpiry).format("YYYY-MM-DD"));
        form_data.append('insurance_expiry_date', moment(insuranceExpiry).format("YYYY-MM-DD"));
       
        EditMember(form_data, (result) => {
            (result.success == true) ? toast.success(result.message) : toast.error(result.message);
            if (result.success == true) {
                
                setTimeout(() => {
                    history.push('/member/member_list');
                }, 3000);
            } 
            if (result.success == false && result.code == 419 ){
               
                result.errObj.forEach(function (arrayItem, index) {
                    for (const prop in arrayItem) {
                        
                        showError(prop, arrayItem[prop]);
                    }
                });
                setTimeout(() => { 
                    errorReset(errors);
                }, 2000);
            }
        });
    };
    const getFileNames = (files) => {
        
        let filesName = [];
        for (var k = 0; k < files.length; k++){
            filesName.push(<>
                <div class='file__value file_'>
                    <div class='file__value--text'>{files[k].name}</div>
                </div>
            </>);
        }
        return filesName;
    }
    const onFileChange = (event ) => {
        
        if(event.target.files.length > 2){
            toast.error('please select only 2 files');
            return;
        }
        if(event.target.name == 'passport'){
            setPassport(event.target.files);
            setPassportName( getFileNames(event.target.files) );
            
        }
        if(event.target.name == 'emirates'){
            setEmirates(event.target.files);
            setEmiratesName(getFileNames(event.target.files) )
        }
        if(event.target.name == 'visa_file'){
            setVisaFile(event.target.files);
            setVisaFileName(getFileNames(event.target.files) )
        }
        if(event.target.name == 'insurance'){
            setInsurance(event.target.files);
            setInsuranceName(getFileNames(event.target.files) )
        }
    }
    const formik = useFormik({ initialValues, onSubmit }); // validationSchema,
    const { handleSubmit, handleChange, values, touched, errors } = formik;
    React.useEffect(() => {
        postRequest(`/memberDetails`, { memberId : id }, (res) => {
           
            values.first_name     = res.result.first_name;
            values.last_name      = res.result.last_name;
            values.email          = res.result.email;
            values.official_email = res.result.official_email;
            values.designation    = res.result.designation;
            values.work_type      = res.result.work_type;
        
            setMobileNo(res.result.mobile_no);
            setOfficialMobileNo(res.result.official_mobile_no);

            setPassportExpiry(new Date(moment(res.result.passport_expiry_date).format("MM/DD/YYYY")) );
            setEmiratesExpiry(new Date(moment(res.result.emirates_expiry_date).format("MM/DD/YYYY")) );
            setVisaExpiry(new Date(moment(res.result.visa_expiry_date).format("MM/DD/YYYY")) );
            setInsuranceExpiry(new Date(moment(res.result.insurance_expiry_date).format("MM/DD/YYYY")) );
   
        });
    }, []);
    const back = () => {
        history.push('/member/member_list');
    }
    return (
        <>
            <div className="page-title-container">
                <Row className="g-0">
                    <Col className="col-auto mb-3 mb-sm-0 me-auto">
                        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/" >
                            <CsLineIcons icon="chevron-left" size="13" />
                            <span className="align-middle text-small ms-1"> Dashboard </span>
                        </NavLink>
                        <h1 className="mb-0 pb-0 display-4" id="title" style={{ marginLeft: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: '#5ebce3', }} > {title} </h1>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col className="col-lg">
                    <Card className="mb-5" style={{ height : "auto", position : "relative", top : "0rem", paddingTop : "0rem", width : "100%", margin : "auto", }} >
                        <Card.Body>
                            <h1>Personal Details</h1>
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3 pt-5 pb-5">
                                    <Col lg="4">
                                        <Form.Label>First Name</Form.Label>
                                        <div>
                                            <Form.Control type="text" placeholder="Enter the first name" value={values.first_name} onChange={handleChange} name="first_name" />
                                            { errors.first_name && touched.first_name && <div className="d-block invalid-tooltip" >{errors.first_name}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Last Name </Form.Label>
                                        <div>
                                            <Form.Control type="text" placeholder="Enter the last name" value={values.last_name} onChange={handleChange} name="last_name" />
                                            { errors.last_name && touched.last_name && <div className="d-block invalid-tooltip" >{errors.last_name}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Personal Email ID  </Form.Label>
                                        <div>
                                            <Form.Control type="email" placeholder="Enter the personal email id" value={values.email} onChange={handleChange} name="email" />
                                            { errors.email && touched.email && <div className="d-block invalid-tooltip" >{errors.email}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Label> Personal Mobile No. </Form.Label>
                                        <div>
                                            <PhoneInput enableSearch={true} placeholder="Enter phone number" value={mobile_no} onChange={(mobile_no) => setMobileNo(mobile_no)} name="mobile_no" />
                                            { errors.mobile_no && touched.mobile_no && <div className="d-block invalid-tooltip" >{errors.mobile_no}</div> }
                                        </div>
                                    </Col>
                                    <hr style={{ width: "100%", opacity: "0.2", marginTop: "34px" }} />
                                    <h1>Official Details</h1>
                                    <Col lg="4" >
                                        <Form.Label> Official Email Id </Form.Label> 
                                        <div>
                                            <Form.Control type="text" value={values.official_email} placeholder="Enter the official email id" onChange={handleChange} name="official_email" />
                                            { errors.official_email && touched.official_email && <div className="d-block invalid-tooltip" >{errors.official_email}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Label> Official Mobile Number </Form.Label>
                                        <div>
                                            <PhoneInput enableSearch={true} placeholder="Enter phone number" value={official_mobile_no} onChange={(mobile_no) => setOfficialMobileNo(mobile_no)} name="official_mobile_no" />
                                            { errors.official_mobile_no && touched.official_mobile_no && <div className="d-block invalid-tooltip">{errors.official_mobile_no}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Designation </Form.Label>
                                        <div>
                                            <Form.Control type="text" placeholder="Enter the designation" value={values.designation} onChange={handleChange} name="designation" />
                                            { errors.designation && touched.designation && <div className="d-block invalid-tooltip" >{errors.designation}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Work Type </Form.Label>
                                        <div>
                                            <Form.Control type="text" placeholder="Enter the work type" value={values.work_type} onChange={handleChange} name="work_type" />
                                            { errors.work_type && touched.work_type && <div className="d-block invalid-tooltip" >{errors.work_type}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Passport Expiry </Form.Label>
                                        <div>
                                            <DatePicker className={"form-control"} selected={passportExpiry} onChange={(date) => setPassportExpiry(date)} name="passportExpiry" minDate={new Date()}  
                                            peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" autoComplete='off' />
                                            { errors.passport_expiry_date && touched.passport_expiry_date && <div className="d-block invalid-tooltip" >{errors.passport_expiry_date}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4" >
                                        <Form.Label> Emirates Expiry Date </Form.Label>
                                        <div>
                                            <DatePicker className={"form-control"} selected={emiratesExpiry} onChange={(date) => setEmiratesExpiry(date)} name="emiratesExpiry" minDate={new Date()}  
                                            peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" autoComplete='off' />
                                            { errors.emirates_expiry_date && touched.emirates_expiry_date && <div className="d-block invalid-tooltip" >{errors.emirates_expiry_date}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Label> Visa Expiry Date </Form.Label>
                                        <div>
                                            <DatePicker className={"form-control"} selected={visaExpiry} onChange={(date) => setVisaExpiry(date)} name="visaExpiry" minDate={new Date()}  
                                            peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" autoComplete='off' />
                                            { errors.visa_expiry_date && touched.visa_expiry_date && <div className="d-block invalid-tooltip" >{errors.visa_expiry_date}</div> }
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Label> Insurance Expiry Date </Form.Label>
                                        <div>
                                            <DatePicker className={"form-control"} selected={insuranceExpiry} onChange={(date) => setInsuranceExpiry(date)} name="insuranceExpiry" minDate={new Date()}  
                                            peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" autoComplete='off'  />
                                            { errors.insurance_expiry_date && touched.insurance_expiry_date && <div className="d-block invalid-tooltip" >{errors.insurance_expiry_date}</div> }
                                        </div>
                                    </Col>
                                    <hr style={{ width: "100%", opacity: "0.2", marginTop: "34px" }} />
                                    <h1>Upload Documents</h1>
                                    <Col xl="4" lg="6">
                                        <div className="container">
                                            <h5>Passport ( Front &amp; Back )</h5>
                                            <div className="wrap">
                                                <h4>Select File Here</h4>
                                                <div className="file">
                                                    <div className="file__input" id="passport_file__input">
                                                        <input className="file__input--file" id="passport" type="file" multiple="multiple" accept=".jpg,.png,.pdf,.doc" name="passport" onChange={onFileChange} />
                                                        <label className="file__input--label" for="passport" data-text-btn="Upload">
                                                            Add Files
                                                        </label>
                                                    </div>
                                                    {passportName}
                                                    <h6 id="contents">File Supported:PDF,JPG,PNG,DOC</h6>
                                                </div>
                                                { errors.passport && touched.passport && <div className="d-block invalid-tooltip" style={{ left: '41%' }}>{errors.passport}</div> }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl="4" lg="6">
                                        <div className="container">
                                            <h5>Emirates ( Front &amp; Back )</h5>
                                            <div className="wrap">
                                                <h4>Select File Here</h4>
                                                <div className="file">
                                                    <div className="file__input " id="emirates_file__input">
                                                        <input className="file__input--file" id="emirates" type="file" multiple="multiple" accept=".jpg,.png,.pdf,.doc" name="emirates" onChange={onFileChange} />
                                                        <label className="file__input--label" for="emirates" data-text-btn="Upload">Add Files</label>
                                                    </div>
                                                    {emiratesName}
                                                    <h6 id="contents">File Supported:PDF,JPG,PNG,DOC</h6>
                                                </div>
                                                { errors.emirates && touched.emirates && <div className="d-block invalid-tooltip" style={{ left: '41%' }}>{errors.emirates}</div> }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl="4" lg="6">
                                        <div className="container">
                                            <h5>Visa</h5>
                                            <div className="wrap">
                                                <h4>Select File Here</h4>
                                                <div className="file">
                                                    <div className="file__input " id="visa_file_file__input">
                                                        <input className="file__input--file" id="visa_file" type="file" multiple="multiple" accept=".jpg,.png,.pdf,.doc" name="visa_file" onChange={onFileChange} />
                                                        <label className="file__input--label" for="visa_file" data-text-btn="Upload">Add Files</label>
                                                    </div>
                                                    {visaFileName}
                                                    <h6 id="contents">File Supported:PDF,JPG,PNG,DOC</h6>
                                                </div>
                                                { errors.visa_file && touched.visa_file && <div className="d-block invalid-tooltip" style={{ left: '41%' }}>{errors.visa_file}</div> }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl="4" lg="6">
                                        <div className="container">
                                            <h5>Insurance</h5>
                                            <div className="wrap">
                                                <h4>Select File Here</h4>
                                                <div className="file">
                                                    <div className="file__input " id="insurance_file__input">
                                                        <input className="file__input--file" id="insurance" type="file" multiple="multiple" accept=".jpg,.png,.pdf,.doc" name="insurance" onChange={onFileChange} />
                                                        <label className="file__input--label" for="insurance" data-text-btn="Upload">Add Files</label>
                                                    </div>
                                                    {insuranceName}
                                                    <h6 id="contents">File Supported:PDF,JPG,PNG,DOC</h6>
                                                </div>
                                                { errors.insurance && touched.insurance && <div className="d-block invalid-tooltip" style={{ left: '41%' }}>{errors.insurance}</div> }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg="6" style={{ width : "100%", display : "flex", justifyContent : "center", alignItems : "center", marginTop : "3rem", }} >
                                        <Button className="btn-icon btn-icon-end" onClick={back} type="reset" >
                                            Cancel <CsLineIcons icon="chevron-right" />
                                        </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button className="btn-icon btn-icon-end" variant="primary" type="submit"  >
                                            Submit <CsLineIcons icon="chevron-right" />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    )
};
export default Createmember;