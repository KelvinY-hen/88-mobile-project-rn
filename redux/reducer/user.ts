import { USER_TYPES } from '../actionTypes/user';

const initialState = {
    user: {},
  };

interface Action{
    type: string,
    payload?: object;
}

export default function user(state = initialState, action: Action) {
    switch (action.type) {
        case USER_TYPES.UPDATE_USER_DATA:
            return {
                ...state,
                user: action.payload
            };
        case USER_TYPES.LOGOUT_USER_DATA:
            return {
                ...state,
                user: {}
            };
        case USER_TYPES.UPDATE_POTRAIT:
            return {
                ...state,
                user: {
                    ...user,
                    potrait: action.payload
                }
            }; 
        default:
        return state;
    }
}