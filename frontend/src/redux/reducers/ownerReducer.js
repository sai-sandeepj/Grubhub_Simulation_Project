import {ALL_ORDERS,CANCEL_ORDER,CHANGE_ORDER_STATUS,ADD_ITEMS,EDIT_ITEM,EDIT_SECTION} from './../actions/ownerActions'

export default function(state,action)
{
    switch(action.type)
    {
        case ALL_ORDERS:
            return{
                ...state,
                result: action.payload
            }
        case CANCEL_ORDER:
                return{
                    ...state,
                    result: action.payload
                }
        case CHANGE_ORDER_STATUS:
                return{
                    ...state,
                    result: action.payload
                }
        case ADD_ITEMS:
                return{
                    ...state,
                    result: action.payload
                }
        case EDIT_ITEM:
                return{
                    ...state,
                    result: action.payload
                }
        case EDIT_SECTION:
                return{
                    ...state,
                    result: action.payload
                }
        default:
                return {...state};
    }
}