import {ADD_TO_CART, REMOVE_FROM_CART} from '../actions/customerActions'

export default function(state,action){
    switch(action.type){
        case ADD_TO_CART:
                return {
                    ...state,
                    result: action.payload
                }
           case REMOVE_FROM_CART:
                return {
                    ...state,
                    result: action.payload
                }
            default:
                return {...state}
    }
}