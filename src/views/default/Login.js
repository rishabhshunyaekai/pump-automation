import React, { useEffect,useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { setCurrentUser } from '../../auth/authSlice';
import { LoginService } from "../../@mock-api/data/datatable"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const history                         = useHistory();
  const dispatch                        = useDispatch();
  const title                           = 'Login';
  const description                     = 'Login Page';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLogin }                     = useSelector((state) => state.auth);
  const initialValues                    = { email: '', userpassword: '' };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    userpassword: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  
  const onSubmit = (values) => {
    setIsSubmitting(true)
    let payload = {
      isLogin: false,
      currentUser: null,
      message: ""
    }
    LoginService(values, result => {
      if (result.success === true) {
        payload = {
          isLogin: true,
          currentUser: result.payload,
          message: result.message
        }
        toast(result.message)
        dispatch(setCurrentUser(payload));
        setIsSubmitting(false); 
      } else {
        toast(result.message)
        payload = {
          isLogin: false,
          currentUser: null,
          message: result.message
        }
        dispatch(setCurrentUser(payload));
        setIsSubmitting(false); 
      }
    });
  }

  useEffect(() => {
    if (isLogin === true) {
      history.push("/dashboard");
    }
  }, [isLogin]);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">ShunyaEkai Technologies</h1>
            {/* <h1 className="display-3 text-white">Ready for Your Project</h1> */}
          </div>
          {/* <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
          </p> */}
          {/* <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Learn More
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
// d-flex justify-content-center align-items-center shadow-deep full-page-content-right-border
  const rightSide = (
    <div className="bg-foreground d-flex justify-content-center align-items-center py-5" style={{borderRadius: '50px', width: '50rem'}}>
      <div className="px-5 d-flex flex-column justify-content-center align-items-center w-100">
        <div className="m-5">
          <NavLink to="/">
            <img src='../img/logo4.svg' />
            {/* <div className="logo-default" /> */}
          </NavLink>
        </div>
        <div className="mb-3">
          <h2 className="cta-1 mb-0" style={{color: '#24A6F6', fontSize: '2em', fontWeight: '700'}}>Welcome, Let's get started!</h2>
          {/* <h2 className="cta-1" style={{color: '#24A6F6'}}>let's get started!</h2> */}
        </div>
        <div className="mb-4">
          <p className="h6" style={{color: "#000", fontSize: "1.3em", fontWeight: '500'}}>Please use your credentials to login.</p>
          {/* <p className="h6">
            If you are not a member, please <NavLink to="/register">register</NavLink>.
          </p> */}
        </div>
        <div className='w-50'>
          <form id="loginForm" className="w-100 tooltip-end-bottom d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit} >
            <div className="mb-4 filled form-group tooltip-end-top w-100">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-4 filled form-group tooltip-end-top w-100">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="userpassword" onChange={handleChange} value={values.userpassword} placeholder="Password" />
              {/* <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                Forgot?
              </NavLink> */}
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <Button disabled={isSubmitting} size="lg" type="submit" style={{backgroundColor: '#24A6F6', borderRadius: '50px'}}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Login;
