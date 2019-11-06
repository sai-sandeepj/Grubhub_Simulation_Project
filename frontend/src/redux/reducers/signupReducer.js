import { AUTH_SIGNUP } from '../actions/signupAction';
import {AUTH_LOGIN_USER_PRESENT} from '../actions/signupAction';

// var initialState = {
//     duplicateUser :false
// }

export default function (state={}, action) {

    switch (action.type) {
        case AUTH_SIGNUP:
            console.log('Inside Reducer', action.payload);
            return {
                ...state,
                result: action.payload
            }
        case AUTH_LOGIN_USER_PRESENT:
            console.log('Inside reducer AUTH_LOGIN_USER_PRESENT');
            return{
                ...state,
                duplicateUser : true
            }        
        
        default:
            return state;
    }
}