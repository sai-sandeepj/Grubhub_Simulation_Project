import React, { Component } from "react";
// import {Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import '../../App.css';
import rootUrl from "../config/settings";
import swal from "sweetalert"
import user_image from "../../images/user_defaultimage.png"
// import cookie from 'react-cookies';
// import {Redirect} from 'react-router';
import { connect } from 'react-redux';
import {getProfile,updateProfile} from '../../redux/actions/profileAction'


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
})

class UserProfile extends Component{
    constructor(props){
        super(props)
            this.state = {
                userName: "Sample",
                userEmail: "sample@abc.com",
                password: '********',
                userAdr: "Sample Address",
                userPhone: "5555555555",
                userZip: "99999",
                profileImage:"",
                profileImagePreview: undefined,
                isUpdated: false
                // restName: "xyz",
                // restAdr:"Sample Resto Address",
                // restZip: "55555",
                // restPhone: "9999999999",
            }
            this.editProfile=this.editProfile.bind(this)
            this.savechanges=this.savechanges.bind(this)
            this.handleChange = this.handleChange.bind(this);
    }


   async componentDidMount(){
        let data={
            userEmail: localStorage.getItem("userEmail")
        }
        await this.props.getProfile(data)
        console.log("Inside get profile after component did mount");
        this.setState({
            userEmail: this.props.profileStateStore.result.userEmail,
            userName: this.props.profileStateStore.result.userName,
            // password: this.props.profileStateStore.result.password,
            userPhone: this.props.profileStateStore.result.userPhone,
            userAdr: this.props.profileStateStore.result.userAdr,
            userZip: this.props.profileStateStore.result.userZip,
            profileImage: this.props.profileStateStore.result.profileImage
        });
        console.log("state updated",this.state)
        console.log("Profile image name",this.props.profileStateStore.result.profileImage);
        if(this.props.profileStateStore.result.profileImage){
            this.setState({
                profileImagePreview: rootUrl+"/download-file/" + this.props.profileStateStore.result.profileImage
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
            axios.post(rootUrl+'/upload-file', data)
            .then(response => {
                if (response.status === 200) {
                    console.log('Profile Photo Name: ', profilePhoto.name);
                    if(profilePhoto.name){
                    this.setState({
                        profileImage: profilePhoto.name,
                        profileImagePreview: rootUrl+"/download-file/" + profilePhoto.name
                    })
                }
                   
                }
            });
    }
    }
    
    editProfile(){
        var frm = document.getElementById('profile-form');
        for (var i = 0; i < frm.length; i++) {
            frm.elements[i].disabled = false;
            // console.log(frm.elements[i])
        }
        // document.getElementById('userName').disabled = false;
        document.getElementById('userName').focus()
        // document.getElementById('password').style.display="block";
        // document.getElementById('btn-edit-profile').style.display="none";
        document.getElementById('btn-submit-profile').style.visibility="visible";
        document.getElementById('btn-cancel-profile').style.visibility="visible";
        document.getElementById('btn-edit').style.visibility="hidden";
        document.getElementById('profileImage').style.visibility="visible";
        
    }

    
    submitProfile=async (details)=>{
        console.log("Inside profile update",details);
        const data = {
            userEmail : details.email,
            // userPassword : details.password,
            userName : details.userName,
            userPhone:details.userPhone,
            userAddress:details.userAddress,
            userZip:details.userZip,
            userImage:this.state.profileImage
            }
            await this.props.updateProfile(data);
            this.savechanges();
    }
    
savechanges() {
    var frm = document.getElementById('profile-form');
            for (var i = 0; i < frm.length; i++) {
                console.log(frm.elements[i])
                frm.elements[i].disabled = true;
            }
           // document.getElementById('userName').focus()
           document.getElementById('password').style.display="none";
           // document.getElementById('btn-edit-profile').style.display="none";
           document.getElementById('btn-submit-profile').style.visibility="hidden";
           document.getElementById('btn-cancel-profile').style.visibility="hidden";
           document.getElementById('btn-edit').style.visibility="visible";
           document.getElementById('profileImage').style.visibility="hidden";
           
}


render(){
    console.log("profile image preview",this.state.profileImagePreview)
    let profileImageData = <img  src={user_image} alt="logo" />
        if (this.state.profileImagePreview) {
            profileImageData = <img src={this.state.profileImagePreview} alt="logo" />
        }
    return(
    <div className="row">
        <div className="col-md-7">
                <span  className="font-weight-bold">Your account</span>
                {/* <button className="btn btn-link" id="btn-edit" onClick={this.edit}>Edit</button> */}
                &nbsp;&nbsp;&nbsp;
                <a className="nav-link-inline" id="btn-edit" href="#edit" onClick={this.editProfile}>Edit</a>
                    <Formik
                    enableReinitialize
                    initialValues={
                        {
                            email:this.state.userEmail,
                            userName:this.state.userName,
                            password:this.state.password,
                            userPhone:this.state.userPhone,
                            userAddress:this.state.userAdr,
                            userZip:this.state.userZip }}
                    validationSchema={SignUpSchema}
                    onSubmit={(values, actions) => {
                        this.submitProfile(values);
                        actions.setSubmitting(false);
                    }}
                    >
                    {({ touched, errors, isSubmitting }) => (
                        <Form id="profile-form">
                            <div className="form-group text-left col-sm-5">
                            <br/>
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

                            <div className="form-group text-left col-sm-5" id="userAddress">
                            <label htmlFor="userAddress">Address</label>
                                <Field
                                    type="text"
                                    name="userAddress"
                                    //   onChange={this.userAdrChangeHandler}
                                    //   value={this.state.userAdr}
                                    disabled
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

                            <div className="form-group text-left col-sm-5" id="userZip">
                            <label htmlFor="userZip">ZIP Code</label>
                                <Field
                                    type="text"
                                    name="userZip"
                                    //   onChange={this.userZipChangeHandler}
                                    //   value={this.state.userZip}
                                    disabled
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
                            <div className="form-group" id="profileImage">
                    <label htmlFor="ProfileImage" ><strong>Profile Image : </strong></label><br />
                    <input type="file" name="ProfileImage" id="ProfileImage" className="btn btn-sm photo-upload-btn" onChange={this.handleChange}/>
                </div>  
                                <div className="formholder">
                <span>
                    <button className="btn btn-primary" type="submit" id="btn-submit-profile">Update Profile</button> 
                &nbsp; <a href="/account" className="btn btn-outline-primary font-weight-bold" id="btn-cancel-profile" name="cancel">Cancel</a>
                </span>
                </div>  
                 </Form>
                 
             )}
            </Formik>
           
    </div>
    <div className="col-md-5 center-content profile-heading">
        {profileImageData}
    </div>
 </div>
 )
}}

// export default UserProfile
// export default UserProfile;
const mapStateToProps = (state) => ({
    profileStateStore: state.profile
})

const mapDispatchToProps=(dispatch)=>{
return {
    getProfile: (data) => dispatch(getProfile(data)),
    updateProfile: (data) => dispatch(updateProfile(data))
};
}

const UpdatedUserProfile    = connect(mapStateToProps, mapDispatchToProps)(UserProfile)
export default UpdatedUserProfile;