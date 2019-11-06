import { SEARCH_ITEM } from '../actions/customerActions'

export default function (state, action) {
    switch (action.type) {
        case SEARCH_ITEM:
            return {
                ...state,
                result: action.payload
            }
        default:
            return { ...state };
    }
}