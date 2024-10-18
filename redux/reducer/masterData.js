import { MASTER_DATA } from '../actionTypes/masterData';

const initialState = {
    questions: []
  };

  export default function withdraw(state = initialState, action) {
    switch (action.type) {
        case MASTER_DATA.ADD_QUESTIONS:
            return {
                ...state,
                questions: action.payload.questions, 
            };
        case MASTER_DATA.CLEAR_QUESTIONS:
            return {
                ...state,
                questions:[]
            };
        default:
            return state;
    }
}