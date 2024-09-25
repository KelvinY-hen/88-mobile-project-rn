import { Types } from '../actionTypes/auth';

const initialState = {
    user: {},
    Token : null,
    isLoggedIn: false,
    test: 'Haiya',
  };

export default function auth(state = initialState, action) {
    switch (action.type) {
        case Types.LOGIN_SUCCESS:
            return {
                ...state,
                Token: action.payload.token,
                isLoggedIn: true
            };
        case Types.UPDATE_USER_DATA:
            return {
                ...state,
                user: action.payload
            };
        case Types.LOGOUT:
            return {
                user: {},
                Token : null,
                isLoggedIn: false,
                test: 'Haiya',
            };
        case Types.TOGGLE_LOGIN:
            return {
                ...state,
                Token: action.payload.token,
                isLoggedIn: true
            };
        default:
        return state;
    }
}