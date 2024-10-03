import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
      logout {
        status
        message
      }
    }
`;

export const ME_QUERY = gql`
  query Query {
    me {
      id
      mobile_number
      agent_linked_code
      balance
      has_pin
    }
  }
`;

export 
const DELETE_USER_BANK_MUTATION = gql`
  mutation DeleteUserBank($id: ID!) {
    deleteUserBank(id: $id) {
      success
      message
      errors {
        code
        message
      }
    }
  }
`;

export const CREATE_WITHDRAW_REQUEST_MUTATION = gql`
  mutation CreateWithdrawRequest(
    $bank_account_id: ID!
    $amount: Float!
    $pin: String!
  ) {
    createWithdrawRequest(
      bank_account_id: $bank_account_id
      amount: $amount
      pin: $pin
    ) {
      success
      message
      data {
        ... on WithdrawRequest {
          id
          user_id
          bank_account_id
          amount
          status
          created_at
          updated_at
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export const CHECK_PIN_QUERY = gql`
  query CheckPin($pin: String!) {
    checkPin(pin: $pin) {
      success
      message
      data {
        ... on UserPin {
          pin
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export 
const CREATE_USER_BANK_MUTATION = gql`
  mutation CreateUserBank(
    $bank_account: String!, 
    $account_name: String!, 
    $bank_id: ID!, 
    $branch_name: String!, 
    $is_primary: Boolean!
  ) {
    createUserBank(
      bank_account: $bank_account, 
      account_name: $account_name, 
      bank_id: $bank_id, 
      branch_name: $branch_name, 
      is_primary: $is_primary
    ) {
      success
      message
      data {
        ... on UserBank {
          id
          bank_account
          account_name
          bank_id
          branch_name
          is_primary
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export 
const GET_USER_BANK = gql`
  query {
    userBanks {
      success
      message
      data {
        ... on UserBank {
          id
          bank_account
          account_name
          bank_id
          branch_name
          is_primary
          created_at
          updated_at
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export const GET_ALL_BANKS = gql`
query Query {
  banks {
    id
    name
  }
}
`;


export const GET_WITHDRAW_REQUEST = gql`
query {
  allWithdrawRequests {
    success
    message
    data {
      ... on WithdrawRequest {
        id
        user_id
        bank_account_id
        amount
        status
        created_at
        updated_at
        bankAccount {
          id
          bank_account
          account_name
          branch_name
          is_primary
          bank {
            id
            name
            country_code
          }
        }
      }
    }
    errors {
      code
      message
    }
  }
}
`;


export const SET_PIN_MUTATION = gql`
mutation SetPin($pin: String!) {
  setPin(pin: $pin) {
    success
    message
    data {
      ... on UserPin {
        pin
      }
    }
    errors {
      code
      message
    }
  }
}
`;

export const REQUEST_OTP_MUTATION = gql`
mutation RequestOTP($phoneNumber: String!, $delivery_type: String!){
    requestOtp(phoneNumber: $phoneNumber, delivery_type: $delivery_type ) {
        success
        message        
        errors {
            code
            message
        }
    }
}
    `

  export const RESET_PIN_TAC_MUTATION = gql`
  mutation ResetPinUsingOtp( $otp: String!, $new_pin: String!){
      resetPinUsingOtp( otp: $otp, new_pin: $new_pin ) {
        success
        message
        data {
            ... on UserPin { 
                pin                        
            }
        }
        errors {
            code
            message
        }

    }
  
  
  }`
export default {
  CREATE_WITHDRAW_REQUEST_MUTATION,
  CREATE_USER_BANK_MUTATION,
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  ME_QUERY,
  GET_USER_BANK,
  GET_ALL_BANKS,
  GET_WITHDRAW_REQUEST,
  REQUEST_OTP_MUTATION,
  CHECK_PIN_QUERY,
  DELETE_USER_BANK_MUTATION,
  SET_PIN_MUTATION,
  RESET_PIN_TAC_MUTATION
};
