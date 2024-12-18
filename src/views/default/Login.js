import React, { useEffect } from 'react';
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

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const title = 'Login';
  const description = 'Login Page';

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    userpassword: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  const initialValues = { email: '', userpassword: '' };

  const onSubmit = (values) => {
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
      } else {
        alert(result.message)
        payload = {
          isLogin: false,
          currentUser: null,
          message: result.message
        }
        dispatch(setCurrentUser(payload));
      }
    });
  }

  const { isLogin } = useSelector((state) => state.auth);
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

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="">
          <NavLink to="/">
            <img src='../img/logo4.svg' />
            {/* <div className="logo-default" /> */}
          </NavLink>
        </div>
        <div className="mb-3">
          <h2 className="cta-1 mb-0 text-primary">Welcome,</h2>
          <h2 className="cta-1 text-primary">let's get started!</h2>
        </div>
        <div className="mb-4">
          <p className="h6">Please use your credentials to login.</p>
          {/* <p className="h6">
            If you are not a member, please <NavLink to="/register">register</NavLink>.
          </p> */}
        </div>
        <div>
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit} >
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="userpassword" onChange={handleChange} value={values.userpassword} placeholder="Password" />
              {/* <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                Forgot?
              </NavLink> */}
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <Button size="lg" type="submit" >
              Login
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
