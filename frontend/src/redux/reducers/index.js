import { combineReducers } from 'redux';
import LoginReducer from './loginReducer';
import SignupReducer from './signupReducer';
import profileReducer from './profileReducer';
import customerReducer from './customerReducer';
import ownerReducer from './ownerReducer';
import cartReducer from './cartReducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
    login: LoginReducer,
    signup: SignupReducer,
    profile: profileReducer,
    cart: cartReducer,
    customerOrders: customerReducer,
    ownerOrders: ownerReducer,
    search: searchReducer
});

export default rootReducer;