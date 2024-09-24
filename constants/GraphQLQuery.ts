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
