import axios from "axios";
import rootUrl from '../../components/config/settings';
import swal from "sweetalert";
export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_SIGNUP = "AUTH_SIGNUP";
export const AUTH_LOGIN_USER_PRESENT = "AUTH_LOGIN_USER_PRESENT";

export function ownerSignup(data){
    return function (dispatch) {
        console.log('Inside Signup');
         //set the with credentials to true
 axios.defaults.withCredentials = true;
 //make a post request with the user data
 axios.post(rootUrl+'/ownerSignup',data)
     .then(response => {
         console.log("inside success" )
         console.log("Status Code : ",response.status);
         if(response.status === 200){
            var result = {
                isNewUserCreated: true
            }

            dispatch({
                type: AUTH_SIGNUP,
                payload: result
            });
         // alert("Signup successfull! You can now login in to your account!")
         swal("Successful","You can now login to your account!", "success");
         }
     })
     .catch(error => {
         console.log("In error");
         console.log('Error Occured!');
         if(JSON.stringify(error).includes('401')){
             //restaurant already exists
             var result = {
                duplicateRestaurant :true,
                isNewOwnerCreated: false
             }
    
             dispatch({
                 type: AUTH_SIGNUP,
                 payload: result
             });
             // alert("ERROR!!!")
             swal("Oops","Restaurant Name already registered at the same Zip code! Please register a different restaurant name.", "error");
             console.log(error);
         }
         else  if(JSON.stringify(error).includes('402')){
             //user email already exists
             var result = {
                duplicateOwner :true,
                isNewOwnerCreated: false
             }
    
             dispatch({
                 type: AUTH_SIGNUP,
                 payload: result
             });
             // alert("ERROR!!!")
             swal("Oops","User Email already exists! Please enter a different email address.", "error");
             console.log(error);
             // alert("User credentials not valid. Please try again!");
         }
         else{
            var result = {
                isNewUserCreated: false,
                 errorRedirect: true
             }
    
             dispatch({
                 type: AUTH_SIGNUP,
                 payload: result
             });
             // alert("ERROR!!!")
             swal("Oops","Something went wrong! Please try agian later.", "error");
             console.log(error);
             // alert("User credentials not valid. Please try again!");
         }

         
     })
    }
}

export function customerSignup(data){
    return function (dispatch) {
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(rootUrl+'/customerSignup',data)
        .then(response => {
            console.log("inside success" )
            console.log("Status Code : ",response.status);
                if(response.status === 200){
                    var result = {
                        isNewUserCreated: true
                    }
        
                    dispatch({
                        type: AUTH_SIGNUP,
                        payload: result
                    });
            // alert("Signup successfull! You can now login in to your account!")
            swal("Successful","You can now login to your account!", "success");
                }
        })
        .catch(error => {
            console.log("test",JSON.stringify(error).includes('402'))
            if(JSON.stringify(error).includes('402')){
                var result = {
                    duplicateUser :true,
                    isNewUserCreated: false
                }
    
                dispatch({
                    type: AUTH_SIGNUP,
                    payload: result
                });
        // alert("Signup successfull! You can now login in to your account!")
        swal("Oops","User Email already exists! Please enter a different email address.", "error");
              }
              else{
            console.log("In error");
            var result = {
                isNewUserCreated: false,
                errorRedirect: true
            }
   
            dispatch({
                type: AUTH_SIGNUP,
                payload: result
            });
            // alert("ERROR!!!")
            swal("Oops","Something went wrong! Please try agian later.", "error");
            console.log(error);
              }
            // alert("User credentials not valid. Please try again!");
        })
}
}