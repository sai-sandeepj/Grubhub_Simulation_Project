import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom"
import NavBar from "../Navbar/navbar";
// import axios from 'axios';
// import cookie from 'react-cookies';
import {Redirect} from 'react-router';
// import rootUrl from "../config/settings";
// import swal from 'sweetalert';

import { connect } from 'react-redux';
import {ownerSignup} from '../../redux/actions/signupAction'

const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const zipRegEx=/^[0-9]{5}(?:-[0-9]{4})?$/
// const phoneRegExp = /^[^0-9][0-9][^0-9]{8,10}$/

const SignUpSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .required("Password is required"),
  userPhone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required("Phone number is required"),
  restName: Yup.string()
    .required("Restaurant name is required"),
 restDesc: Yup.string()
    .required("Restaurant description is required"),
  restPhone: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required("Restaurant phone number is required"),
  restAddress: Yup.string()
    .required("Restaurant Address is required"),
  restZip: Yup.string()
    .matches(zipRegEx,"Zip code is not valid")
    .required("Restaurant ZIP code is required")
});

class OwnerSignUpForm extends Component {
    constructor(){
        super()
        this.state={
            authFlag:false
        }
        this.submitSignup=this.submitSignup.bind(this)
    }

submitSignup = (details) => {
    console.log("Inside submit signup",details);
    const data = {
        userName: details.userName,
        userImage: "none",
        userEmail: details.email,
        userPassword :  details.password,
        userPhone: details.userPhone,
        userAddress: "default",
        userZip: "default",
        restAddress:details.restAddress,
        restImage: "none",
        restDesc:details.restDesc,
        restName:details.restName,
        restPhone:details.restPhone,
        restZip:details.restZip,
        accountType: 2
        }
        this.props.ownerSignup(data)
}
  render() {
    let redirectVar=null;
    if(this.state.authFlag===true){
        redirectVar = <Redirect t0="/"/>
    }
    return (
            <div>
              {redirectVar}    
                  <NavBar/>
                 <div className="container-fluid" id="signup">
                    <div className="row align-items-center h-100 ">    
                        <div className="col-md-4 mx-auto">    
                            <div className="card shadow p-3 mb-5 rounded">  
                                <div className="card-body">
                                    <h4 className="text-black text-left font-weight-bold">Create your owner account!</h4>
                                    <br/>
                                    <Formik
                                        initialValues={{ userName: "", email:"" , password: "", userPhone:"", restDesc:"", restAddress:"", restName:"",restPhone:"",restZip:"" }}
                                        validationSchema={SignUpSchema}
                                        onSubmit={(values, actions) => {
                                          this.submitSignup(values)
                                          actions.setSubmitting(false);
                                        }}
                                        >
                                        {({ touched, errors, isSubmitting }) => (
                                            <Form>
                                                
                                                <div className="form-group text-left">
                                                <label htmlFor="userName">Name</label>
                                                    <Field
                                                          type="text"
                                                          name="userName"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.userName && errors.userName ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="userName"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                
                                                <div className="form-group text-left">
                                                <label htmlFor="email">Email</label>
                                                    <Field
                                                          type="email"
                                                          name="email"
                                                          className={`form-control ${
                                                          touched.email && errors.email ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="email"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                
                                                <div className="form-group text-left">
                                                <label htmlFor="email">Password (8 character minimum)</label>
                                                    <Field
                                                        type="password"
                                                        name="password"
                                                        className={`form-control ${
                                                        touched.password && errors.password ? "is-invalid" : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="password"
                                                        className="invalid-feedback"
                                                    />
                                                </div>
                                                
                                                <div className="form-group text-left">
                                                <label htmlFor="userPhone">Phone number</label>
                                                    <Field
                                                          type="text"
                                                          name="userPhone"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.userPhone && errors.userPhone ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="userPhone"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="restName">Restaurant Name</label>
                                                    <Field
                                                          type="text"
                                                          name="restName"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.restName && errors.restName ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="restName"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="restDesc">Restaurant description</label>
                                                    <Field
                                                          type="text"
                                                          name="restDesc"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.restDesc && errors.restDesc ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="restDesc"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="restPhone">Restaurant Phone number</label>
                                                    <Field
                                                          type="test"
                                                          name="restPhone"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.restPhone && errors.restPhone ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="restPhone"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="restAddress">Restaurant Address</label>
                                                    <Field
                                                          type="text"
                                                          name="restAddress"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.restAddress && errors.restAddress ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="restAddress"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="restZip">Restaurant ZIP Code</label>
                                                    <Field
                                                          type="text"
                                                          name="restZip"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.restZip && errors.restZip ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="restZip"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <br/>
                                                <button
                                                    type="submit"
                                                    id="signin"
                                                    className="btn btn-block text-white font-weight-bold"
                                                    // disabled={!isSubmitting}
                                                >
                                                    {isSubmitting ? "Please wait..." : "Sign Up"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                
                                    <br/>
                                    Already have an account?&nbsp;<Link to="/login">Sign in!</Link>
                                    
                                </div>
                            </div>
                        </div> 
                    </div>
                 </div>  
            </div> 
    );
}}


// export default OwnerSignUpForm;
const mapStateToProps = (state) => ({
    signupStateStore: state.signup
})

const mapDispatchToProps=(dispatch)=>{
return {
    ownerSignup: (data) => dispatch(ownerSignup(data))
};
}

const updatedOwnerSignUp    = connect(mapStateToProps, mapDispatchToProps)(OwnerSignUpForm)
export default updatedOwnerSignUp;


