import { gql } from '@apollo/client';

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
  query {
    me {
      id
      mobile_number
      agent_linked_code
    }
  }
`;

export const CREATE_WITHDRAW_REQUEST_MUTATION = gql`
  mutation CreateWithdrawRequest(
    $bank_account_id: ID!, 
    $amount: Float!, 
    $pin: String!
  ) {
    createWithdrawRequest(
      bank_account_id: $bank_account_id, 
      amount: $amount, 
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
