import { WITHDRAW_TYPES } from '../actionTypes/withdraw';

const initialState = {
    withdraw: {
        pin: ["", "", "", "", "", ""],
        accNo: '',
        selectedAccount:null,
        bank: null,
        accName: '',
        amount: 0,
        branch: '',
        allowPin: true,
        allowBiometrics: true,
        biometricsStatus: null,
        biometricsValue: null,
        allowQnA: true,
        QnA: [],
    },
  };

  export default function withdraw(state = initialState, action) {
    switch (action.type) {
        case WITHDRAW_TYPES.ADD_WITHDRAW_SECURITY_STEP:
            return {
                ...state,
                withdraw: {
                    ...state.withdraw, // Spread the current withdraw state here
                    allowPin: action.payload.allowPin,
                    allowBiometrics: action.payload.allowBiometrics,
                    allowQnA: action.payload.allowQnA,
                }
            };
        case WITHDRAW_TYPES.CLEAR_WITHDRAW_SECURITY_STEP:
            return {
                ...state,
                withdraw: {
                    ...state.withdraw, // Spread the current withdraw state here
                    allowPin: true,
                    allowBiometrics: true,
                    allowQnA: true,
                }
            };
        case WITHDRAW_TYPES.ADD_WITHDRAW_DATA:
            return {
                ...state,
                withdraw: {
                    ...state.withdraw, // Spread the current withdraw state here
                    pin: action.payload.pin,
                    accNo: action.payload.accNo,
                    selectedAccount: action.payload.selectedAccount,
                    bank: action.payload.bank,
                    accName: action.payload.name,
                    branch: action.payload.branch,
                    amount: action.payload.amount,
                }
            };
        case WITHDRAW_TYPES.ADD_BIOMETRIC_DATA:
            return {
                ...state,
                withdraw: {
                    ...state.withdraw, // Spread the current withdraw state here
                    biometricsStatus: action.payload.status,
                    biometricsValue: action.payload.value,
                }
            };
        case WITHDRAW_TYPES.ADD_QNA_DATA:
            return {
                ...state,
                withdraw: {
                    ...state.withdraw, // Spread the current withdraw state here
                    QnA: action.payload.qna, // Assuming QnA data comes as an array
                }
            };
        case WITHDRAW_TYPES.CLEAN_WITHDRAW_DATA:
            return {
                ...state,
                withdraw: {
                    pin: ["", "", "", "", "", ""],
                    accNo: '',
                    selectedAccount:null,
                    bank: null,
                    accName: '',
                    amount: 0,
                    branch: '',
                    allowPin: true,
                    allowBiometrics: true,
                    biometricsStatus: null,
                    biometricsValue: null,
                    allowQnA: true,
                    QnA: [],
                }
            };
        default:
            return state;
    }
}