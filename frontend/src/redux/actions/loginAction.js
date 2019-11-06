import axios from "axios";
import rootUrl from '../../components/config/settings';
import swal from "sweetalert";
import cookie from "react-cookies";
import jwtDecode from "jwt-decode";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

export const AUTH_LOGIN = "AUTH_LOGIN";
export const SIGNUP = "SIGNUP";
export const AUTH_LOGIN_USER_PRESENT = "AUTH_LOGIN_USER_PRESENT";


const authToken = "JWT " + localStorage.getItem("token");

const jwt = localStorage.getItem("token");





//target action
export function submitLogin(data) {
    return function (dispatch) {
        console.log('Inside Action:', data);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(rootUrl + '/login', data)
            .then(response => {
                console.log("inside success")
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("response", response.data)
                    localStorage.setItem('token', response.data);
                    localStorage.setItem('authToken', `JWT ${response.data}`);
                    const decoded = jwtDecode(response.data);
                    localStorage.setItem("accountType", decoded.accountType)
                    localStorage.setItem("userName", decoded.userName)
                    localStorage.setItem("userEmail", decoded.userEmail)

                    var resultData = {
                        userName: response.data.userName,
                        // Accounttype : response.data.Accounttype,
                        isAuthenticated: true
                    }
                    console.log('Result in action: ', resultData)
                    dispatch({
                        type: AUTH_LOGIN,
                        payload: resultData
                    });

                }
            })
            .catch(err => {
                var resultData = {
                    isAuthenticated: false
                }
                console.log(err);
                console.log('inside res status', err);
                dispatch({
                    type: AUTH_LOGIN,
                    payload: resultData
                });
                swal("Oops...", "User credentials not valid.", "error");
            })
    }
}