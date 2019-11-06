import { PLACE_ORDER, PREVIOUS_ORDERS, UPCOMING_ORDERS, CUISINE_RESTAURANTS } from '../actions/customerActions';

export default function (state, action) {
    switch (action.type) {
        case PLACE_ORDER:
            return {
                ...state,
                result: action.payload
            }
        case PREVIOUS_ORDERS:
            return {
                ...state,
                result: action.payload
            }
        case UPCOMING_ORDERS:
            return {
                ...state,
                result: action.payload
            }
        case CUISINE_RESTAURANTS:
            return {
                ...state,
                result: action.payload
            }
        default:
            return { ...state };
    }
}