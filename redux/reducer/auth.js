import { Types } from '../actionTypes/auth';

const initialState = {
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
        case Types.LOGOUT:
            return {
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