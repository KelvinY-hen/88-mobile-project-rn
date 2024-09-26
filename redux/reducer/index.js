import {combineReducers} from "redux"
import auth from "./auth"
import user from "./user";

const reducerArray = combineReducers({
    auth : auth,
    user : user,
})

export default reducerArray;