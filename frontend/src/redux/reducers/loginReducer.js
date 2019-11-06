import { AUTH_LOGIN } from '../actions/loginAction';


//Reducer listening to action types

export default function (state={}, action){

    switch(action.type){

        case AUTH_LOGIN: 
            return {
                ...state,
                result : action.payload
            }  
        default: 
            return state;
    }
}