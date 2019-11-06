import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Link} from "react-router-dom";
import NavBar from "../Navbar/navbar";
import axios from 'axios';
// import cookie from 'react-cookies';
import {Redirect} from 'react-router';
// import swal from 'sweetalert';
// import rootUrl from "../config/settings";

import { connect } from 'react-redux';
import {customerSignup} from '../../redux/actions/signupAction'

const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const zipRegEx=/^[0-9]{5}(?:-[0-9]{4})?$/

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
  userAddress: Yup.string()
    .required("Address is required"),
  userZip: Yup.string()
    .matches(zipRegEx,"Zip code is not valid")
    .required("ZIP code is required")
});

class CustomerSignUpForm extends Component {
    constructor(){
        super()
        this.state={
            authFlag:false
        }
        this.submitSignup=this.submitSignup.bind(this)
    }

submitSignup = (details) => {
    console.log("Inside submit login",details);
    const data = {
        userName: details.userName,
        userEmail: details.email,
        userImage: "none",
        userPassword :  details.password,
        userPhone: details.userPhone,
        userAddress: details.userAddress,
        userZip: details.userZip,
        accountType: 1
        }
    this.props.customerSignup(data)
}


  render() {
      let redirectVar=null;
      if(this.props.signupStateStore.result){
        if(this.props.signupStateStore.result.isNewUserCreated===true){
              redirectVar=<Redirect to="/"/>   
        }   
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
                                    <h4 className="text-black text-left font-weight-bold">Create your customer account!</h4>
                                    <br/>
                                    <Formik
                                        initialValues={{
                                            email:"",
                                            userName:"",
                                            password:"",
                                            userPhone:"",
                                            userAddress:"",
                                            userZip:""  }}
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
                                                <label htmlFor="userAddress">Address</label>
                                                    <Field
                                                          type="text"
                                                          name="userAddress"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.userAddress && errors.userAddress ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="userAddress"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="form-group text-left">
                                                <label htmlFor="userZip">ZIP Code</label>
                                                    <Field
                                                          type="text"
                                                          name="userZip"
                                                        //   autofocus="true"
                                                          className={`form-control ${
                                                          touched.userZip && errors.userZip ? "is-invalid" : ""
                                                          }`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="userZip"
                                                        align="text-left"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                <br/>
                                                <button
                                                    type="submit"
                                                    id="signin"
                                                    className="btn btn-block text-white font-weight-bold"
                                                    disabled={isSubmitting}
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


// export default CustomerSignUpForm;
const mapStateToProps = (state) => ({
    signupStateStore: state.signup
})

const mapDispatchToProps=(dispatch)=>{
return {
    customerSignup: (data) => dispatch(customerSignup(data))
};
}

const updatedCustomerSignUp    = connect(mapStateToProps, mapDispatchToProps)(CustomerSignUpForm)
export default updatedCustomerSignUp;


