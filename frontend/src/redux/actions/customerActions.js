// import axios from "axios";
// import rootUrl from '../../components/config/settings';
// import swal from "sweetalert";
export const SEARCH_ITEM = "SEARCH_ITEM";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const PLACE_ORDER = "PLACE_ORDER";
export const PREVIOUS_ORDERS = "PREVIOUS_ORDERS";
export const UPCOMING_ORDERS = "UPCOMING_ORDERS";
export const CUISINE_RESTAURANTS = "CUISINE_RESTAURANTS";

export function searchItem(data) {
    return function (dispatch) {
        dispatch({
            type: SEARCH_ITEM,
            payload: data
        });
    }
}

export function cuisineRest(data) {
    return function (dispatch) {
        dispatch({
            type: CUISINE_RESTAURANTS,
            payload: data
        })
    }
}



export function addToCart(data) {
    return (dispatch) => {

        dispatch(
            {
                type: ADD_TO_CART,
                payload: data
            });
    }
}

export function removeFromCart(data) {
    return (dispatch) => {

        dispatch(
            {
                type: REMOVE_FROM_CART,
                payload: data
            });
    }
}


export function placeOrder() {
    return (dispatch) => {
        var resultData = {
            orderPlace: true
        }
        dispatch(
            {
                type: PLACE_ORDER,
                payload: resultData
            });
    }
}