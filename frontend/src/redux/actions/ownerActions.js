import axios from "axios";
import rootUrl from '../../components/config/settings';
import swal from "sweetalert";
export const ALL_ORDERS = "ALL_ORDERS";
export const ACCEPT_ORDER = "ACCEPT_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const CHANGE_ORDER_STATUS = "CHANGE_ORDER_STATUS"
export const ADD_ITEMS = "ADD_ITEMS";
export const EDIT_ITEM = "EDIT_ITEM";
export const EDIT_SECTION = "EDIT_SECTION";

export function allOrders(data){
    return (dispatch)=>{

        dispatch(
            {
                type: ALL_ORDERS,
                payload: data
            });
    }
}

export function acceptOrder(data){
    return (dispatch)=>{

        dispatch(
            {
            type: ACCEPT_ORDER,
            payload: data
            });
    }
}

export function cancelOrder(data){
    return (dispatch)=>{

        dispatch(
            {
            type: CANCEL_ORDER,
            payload: data
            });
    }
}

export function manageOrder(data){
    return (dispatch)=>{

        dispatch(
            {
            type: CHANGE_ORDER_STATUS,
            payload: data
            });
    }
}

export function addItems(data){
    return (dispatch)=>{

        dispatch(
            {
            type: ADD_ITEMS,
            payload: data
            });
    }
}

export function editSection(data){
    return (dispatch)=>{

        dispatch(
            {
                type:EDIT_SECTION,
                payload: data
            });
    }
}

export function editItem(data){
    return (dispatch)=>{

        dispatch(
            {
                type:EDIT_ITEM,
                payload: data
            });
    }
}

