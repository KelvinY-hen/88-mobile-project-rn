import {combineReducers} from "redux"
import auth from "./auth"
import user from "./user";
import withdraw from "./withdraw";
import masterData from "./masterData";

const reducerArray = combineReducers({
    auth : auth,
    user : user,
    withdraw : withdraw,
    masterData : masterData,
})

export default reducerArray;