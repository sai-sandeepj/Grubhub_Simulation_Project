import React, { Component } from "react";
// import {Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import rootUrl from "../config/settings";
import swal from "sweetalert";
import user_image from "../../images/user_defaultimage.png"
import rest_image from "../../images/restaurant_defaultimage.jpg"
// import cookie from 'react-cookies';
// import {Redirect} from 'react-router';

import { connect } from 'react-redux';
import { getProfile, updateProfile } from '../../redux/actions/profileAction'

const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/

const ProfileSchema = Yup.object().shape({
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
});

const RestaurantSchema = Yup.object().shape({
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
        .matches(zipRegEx, "Zip code is not valid")
        .required("Restaurant ZIP code is required")
});

class OwnerProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "Sample owner",
            userEmail: "owner@abc.com",
            password: '********',
            userPhone: "5555555555",
            profileImage: "",
            profileImagePreview: undefined,

            restName: "Sample Restaurant",
            restDesc: "No description",
            restAdr: "Sample Resto Address",
            restZip: "55555",
            restPhone: "9999999999",
            restImage: "",
            restImagePreview: undefined
        }
        this.editProfile = this.editProfile.bind(this)
        this.editRestaurant = this.editRestaurant.bind(this)
        this.savechanges = this.savechanges.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        let data = {
            userEmail: localStorage.getItem("userEmail")
        }
        console.log("Inside get profile after component did mount");
        await this.props.getProfile(data)

        console.log("this.props.profileStateStore", this.props.profileStateStore.result)
        if (this.props.profileStateStore.result) {
            console.log("hi")
            this.setState({
                userName: this.props.profileStateStore.result.userName,
                userEmail: this.props.profileStateStore.result.userEmail,
                // password: this.props.profileStateStore.result.password,
                userPhone: this.props.profileStateStore.result.userPhone,
                profileImage: this.props.profileStateStore.result.profileImage,
                profileImagePreview: this.props.profileStateStore.result.profileImagePreview,

                restName: this.props.profileStateStore.result.restName,
                restDesc: this.props.profileStateStore.result.restDesc,
                restAdr: this.props.profileStateStore.result.restAdr,
                restZip: this.props.profileStateStore.result.restZip,
                restPhone: this.props.profileStateStore.result.restPhone,
                restImage: this.props.profileStateStore.result.restImage,
                restImagePreview: this.props.profileStateStore.result.restImagePreview
            })
        }

    }


    //handle change of profile image
    handleChange = (e) => {
        const target = e.target;
        const name = target.name;

        if (name === "ProfileImage") {
            console.log(target.files);
            var profilePhoto = target.files[0];
            var data = new FormData();
            data.append('photos', profilePhoto);
            axios.defaults.withCredentials = true;
            axios.post(rootUrl + '/upload-file', data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Profile Photo Name: ', profilePhoto.name);
                        this.setState({
                            profileImage: profilePhoto.name,
                            profileImagePreview: rootUrl + '/download-file/' + profilePhoto.name
                        })
                    }
                });
        }
    }

    //handle change of restaurant image
    handleChangeRest = (e) => {
        const target = e.target;
        const name = target.name;

        if (name === "RestImage") {
            console.log(target.files);
            var profilePhoto = target.files[0];
            var data = new FormData();
            data.append('photos', profilePhoto);
            axios.defaults.withCredentials = true;
            axios.post(rootUrl + '/upload-file', data)
                .then(response => {
                    if (response.status === 200) {
                        console.log('Rest Photo Name: ', profilePhoto.name);
                        this.setState({
                            restImage: profilePhoto.name,
                            restImagePreview: rootUrl + '/download-file/' + profilePhoto.name
                        })
                    }
                });
        }
    }


    editProfile() {
        var frm = document.getElementById('profile-form');
        console.log("inside edit fomr", frm.length)
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('userName').focus()
        // document.getElementById('password').style.display="block";
        // document.getElementById('btn-edit-profile').style.display="none";
        // document.getElementById('btn-submit-profile').style.visibility="visible";
        document.getElementById('btn-submit-profile').style.visibility = "visible";
        document.getElementById('btn-edit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-cancel-profile').style.visibility = "visible";
        document.getElementById('btn-edit').style.visibility = "hidden";
        document.getElementById('profileImage').style.visibility = "visible";
    }

    editRestaurant() {
        var frm = document.getElementById('restaurant-form');
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('restName').focus();
        document.getElementById('btn-edit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-submit-restaurant').style.visibility = "visible";
        document.getElementById('btn-cancel-restaurant').style.visibility = "visible";
        document.getElementById('btn-edit').style.visibility = "hidden";
        document.getElementById('restImages').style.visibility = "visible";
    }

    submitProfile = async (details) => {
        console.log("Inside profile update", details);
        const data = {
            userEmail: details.email,
            // userPassword : details.password,
            userName: details.userName,
            userPhone: details.userPhone,
            userAddress: details.userAddress,
            userZip: details.userZip,
            userImage: this.state.profileImage,
            restName: this.props.profileStateStore.result.restName,
            restDesc: this.props.profileStateStore.result.restDesc,
            restAddress: this.props.profileStateStore.result.restAddress,
            restZip: this.props.profileStateStore.result.restZip,
            restPhone: this.props.profileStateStore.result.restPhone,
            restImage: this.props.profileStateStore.result.restImage
        }
        await this.props.updateProfile(data);
        this.savechanges()
    }

    submitRestaurant = async (details) => {
        console.log("Inside restaurant submit", details);
        console.log("rest image", this.state.restImage)
        const data = {
            userEmail: localStorage.getItem("userEmail"),
            userName: this.props.profileStateStore.result.userName,
            userEmail: this.props.profileStateStore.result.userEmail,
            // password: this.props.profileStateStore.result.password,
            userPhone: this.props.profileStateStore.result.userPhone,
            userImage: this.props.profileStateStore.result.profileImage,

            restName: details.restName,
            restDesc: details.restDesc,
            restAddress: details.restAddress,
            restZip: details.restZip,
            restPhone: details.restPhone,
            restImage: this.state.restImage
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        await this.props.updateProfile(data)
        this.savechanges()
    }

    savechanges() {
        var frm = document.getElementById('restaurant-form');
        for (var i = 0; i < frm.length; i++) {
            // console.log(frm.elements[i])
            frm.elements[i].disabled = true;
        }
        var frm1 = document.getElementById('profile-form');
        for (var j = 0; j < frm1.length; j++) {
            // console.log(frm1.elements[j])
            frm1.elements[j].disabled = true;
        }
        // document.getElementById('userName').focus()
        document.getElementById('password').style.display = "none";
        // document.getElementById('btn-edit-profile').style.display="none";
        document.getElementById('btn-edit-restaurant').style.visibility = "visible";
        document.getElementById('btn-submit-profile').style.visibility = "hidden";
        document.getElementById('btn-cancel-profile').style.visibility = "hidden";
        document.getElementById('btn-edit').style.visibility = "visible";
        document.getElementById('btn-edit-restaurant').style.visibility = "visible";
        document.getElementById('btn-submit-restaurant').style.visibility = "hidden";
        document.getElementById('btn-cancel-restaurant').style.visibility = "hidden";
        document.getElementById('btn-edit').style.visibility = "visible";
        document.getElementById('profileImage').style.visibility = "hidden";
        document.getElementById('restImages').style.visibility = "hidden";
    }

    render() {
        let profileImageData = <img src={user_image} alt="logo" />
        console.log("final profile image check", this.state.profileImagePreview)
        if (this.state.profileImagePreview) {
            profileImageData = <img src={this.state.profileImagePreview} alt="logo" />
        }
        let restImageData = <img src={rest_image} alt="logo" />
        if (this.state.restImagePreview) {
            restImageData = <img src={this.state.restImagePreview} alt="logo" />
        }
        return (
            <div className="row">
                <div className="col-md-7">
                    <span className="font-weight-bold">Your account</span>
                    &nbsp;&nbsp;&nbsp;
        <a className="nav-link-inline" id="btn-edit" href="#edit" onClick={this.editProfile}>Edit</a>
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                email: this.state.userEmail,
                                userName: this.state.userName,
                                password: this.state.password,
                                userPhone: this.state.userPhone,
                                userAddress: "default",
                                userZip: '00000'
                            }}
                        validationSchema={ProfileSchema}
                        onSubmit={(values, actions) => {
                            this.submitProfile(values)
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form id="profile-form">
                                <div className="form-group text-left col-sm-5">
                                    <br />
                                    <label htmlFor="userName">Name</label>
                                    <Field
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        //   onChange={this.userNameChangeHandler}
                                        //   value={this.state.userName}
                                        disabled
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

                                <div className="form-group text-left col-sm-5" id="password">
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        // onChange={this.passwordChangeHandler}
                                        // value={this.state.password}
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="email">Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        //   onChange={this.userEmailChangeHandler}
                                        //   value={this.state.userEmail}
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="userPhone">Phone number</label>
                                    <Field
                                        type="text"
                                        name="userPhone"
                                        //   onChange={this.userPhoneChangeHandler}
                                        //   value={this.state.userPhone}
                                        disabled
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

                                <div className="form-group" id="profileImage">
                                    <label htmlFor="ProfileImage"><strong>Profile Image : </strong></label><br />
                                    <input type="file" name="ProfileImage" id="ProfileImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChange} />
                                </div>

                                <div className="formholder">
                                    <span>
                                        <button className="btn btn-primary" type="submit" id="btn-submit-profile">Update Profile</button>
                                        &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-profile" name="cancel">Cancel</a>
                                    </span>
                                </div>
                                {/* &nbsp; */}
                            </Form>

                        )}
                    </Formik>


                    <span className="font-weight-bold">Restaurant details</span>
                    &nbsp;&nbsp;&nbsp;
        <a className="nav-link-inline" id="btn-edit-restaurant" href="#edit" onClick={this.editRestaurant}>Edit</a>
                    <br /><br />
                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                restAddress: this.state.restAdr,
                                restDesc: this.state.restDesc,
                                restName: this.state.restName,
                                restPhone: this.state.restPhone,
                                restZip: this.state.restZip
                            }}
                        validationSchema={RestaurantSchema}
                        onSubmit={(values, actions) => {
                            this.submitRestaurant(values)
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (

                            <Form id="restaurant-form">
                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restName">Restaurant Name</label>
                                    <Field
                                        type="text"
                                        name="restName"
                                        //   autofocus="true"
                                        id="restName"
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restDesc">Restaurant Description</label>
                                    <Field
                                        type="text"
                                        name="restDesc"
                                        //   autofocus="true"
                                        id="restDesc"
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restPhone">Restaurant Phone number</label>
                                    <Field
                                        type="test"
                                        name="restPhone"
                                        //   autofocus="true"
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restAddress">Restaurant Address</label>
                                    <Field
                                        type="text"
                                        name="restAddress"
                                        //   autofocus="true"
                                        disabled
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

                                <div className="form-group text-left col-sm-5">
                                    <label htmlFor="restZip">Restaurant ZIP Code</label>
                                    <Field
                                        type="text"
                                        name="restZip"
                                        //   autofocus="true"
                                        disabled
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
                                <br />

                                <div className="form-group" id="restImages">
                                    <label htmlFor="RestImage"><strong>Restaurant Image : </strong></label><br />
                                    <input type="file" name="RestImage" id="restImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChangeRest} />
                                </div>

                                <div className="formholder">
                                    <span>
                                        <button className="btn btn-primary" type="submit" id="btn-submit-restaurant">Update</button>
                                        &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-restaurant" name="cancel">Cancel</a>
                                    </span>
                                </div>


                            </Form>

                        )}
                    </Formik>
                </div>
                <div className="col-md-5 center-content profile-heading">
                    ProfileImage<br /><br />
                    {profileImageData}<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    Restaurant Image<br /><br />
                    {restImageData}
                </div>
                {/* <div className="center-content profile-heading">
        {restImageData}
    </div> */}
            </div>
        )
    }
}

// export default OwnerProfile;
const mapStateToProps = (state) => ({
    profileStateStore: state.profile
})

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: (data) => dispatch(getProfile(data)),
        updateProfile: (data) => dispatch(updateProfile(data))
    };
}

const updatedOwnerProfile = connect(mapStateToProps, mapDispatchToProps)(OwnerProfile)
export default updatedOwnerProfile;