import axios from "axios";
import rootUrl from '../../components/config/settings';
import swal from "sweetalert";
export const GET_PROFILE = "GET_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_RESTAURANT_DETAILS = "UPDATE_RESTAURANT_DETAILS";


export function getProfile(data) {
  return async (dispatch) => {
    console.log("values", data)
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    await axios.post(rootUrl + '/getprofile', data, {
      headers: { "Authorization": localStorage.getItem("authToken") }
    })
      .then(response => {
        console.log("inside success", response.data)
        console.log("Status Code : ", response.status);

        if (response.status === 200) {
          if (response.data.accountType === 2) {
            var resultData = {
              userEmail: response.data.userEmail,
              userName: response.data.userName,
              userPhone: response.data.userPhone,
              //   password: response.data.userPassword,
              profileImage: response.data.userImage,
              //   userAdr: response.data[0].userAddress,
              //   userZip: response.data[0].userZip,
              restName: response.data.restaurant.restName,
              restDesc: response.data.restaurant.restDesc,
              restAdr: response.data.restaurant.restAddress,
              restZip: response.data.restaurant.restZip,
              restPhone: response.data.restaurant.restPhone,
              restImage: response.data.restaurant.restImage
            }
            console.log("Profile image name", response.data.userImage);
            if (response.data.userImage) {
              resultData = { ...resultData, profileImagePreview: rootUrl + '/download-file/' + response.data.userImage }
            }
            if (response.data.restaurant.restImage) {
              resultData = { ...resultData, restImagePreview: rootUrl + '/download-file/' + response.data.restaurant.restImage }
            }
          }
          else {
            var resultData = {
              userEmail: response.data.userEmail,
              userName: response.data.userName,
              // password: response.data.userPassword,
              userPhone: response.data.userPhone,
              userAdr: response.data.userAddress,
              userZip: response.data.userZip,
              profileImage: response.data.userImage
            }
            if (response.data.userImage) {
              resultData = { ...resultData, profileImagePreview: rootUrl + '/profile/download-file/' + response.data.userImage }
            }
          }
          dispatch(
            {
              type: GET_PROFILE,
              payload: resultData
            });
        }
      })
      .catch(err => {
        console.log(err);
        console.log('inside res status', err);
        swal("Oops...", "Something went wrong! Please try again later", "error");
      })
  }
}

export function updateProfile(data) {
  return (dispatch) => {
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(rootUrl + '/updateprofile', data, {
      headers: { "Authorization": localStorage.getItem("authToken") }
    })
      .then(response => {
        console.log("inside success")
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log("success", response)
          var resultData = {
            profileUpdated: true
          }
          dispatch(
            {
              type: UPDATE_PROFILE
              // payload: resultData
            });
          localStorage.setItem("userName", data.userName)
          swal("Success", "Profile updated succesfully!", "success");
          //  window.location.reload();

        }

      })
      .catch(error => {
        console.log("In error");
        console.log(error);
        var resultData = {
          profileUpdated: false
        }
        dispatch(
          {
            type: UPDATE_PROFILE
            // payload: resultData
          });
        swal("Oops...", "Something went wrong! Please try again later", "error");
        // alert("Update failed! Please try again")
      })
  };
}