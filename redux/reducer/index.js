import {combineReducers} from "redux"
import auth from "./auth"

const reducerArray = combineReducers({
    auth : auth,
})

export default reducerArray;