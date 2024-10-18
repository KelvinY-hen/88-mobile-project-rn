import {combineReducers} from "redux"
import auth from "./auth"
import user from "./user";
import withdraw from "./withdraw";

const reducerArray = combineReducers({
    auth : auth,
    user : user,
    withdraw : withdraw,
})

export default reducerArray;