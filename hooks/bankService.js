// bankService.js

import { gql, useMutation } from "@apollo/client";
import { Toast } from "react-native-toast-message"; // or any other Toast package you use

export const graphQL_registerBank = async ({
  accNo,
  name,
  selectedBank,
  branch,
  mainToggle = false,
}) => {
  const CREATE_USER_BANK_MUTATION = gql`
    mutation CreateUserBank(
      $bank_account: String!
      $account_name: String!
      $bank_id: ID!
      $branch_name: String!
      $is_primary: Boolean!
    ) {
      createUserBank(
        bank_account: $bank_account
        account_name: $account_name
        bank_id: $bank_id
        branch_name: $branch_name
        is_primary: $is_primary
      ) {
        success
        message
        data {
          ... on UserBank {
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

  const [createUserBankMutation] = useMutation(CREATE_USER_BANK_MUTATION);
  // Validate account number
//   if (!accNo) {
//     Toast.show({
//       type: "error",
//       text1: "Account number is required",
//       visibilityTime: 3000,
//     });
//     return;
//   }

//   // Validate account name
//   if (!name) {
//     Toast.show({
//       type: "error",
//       text1: "Account name is required",
//       visibilityTime: 3000,
//     });
//     return;
//   }

//   // Validate bank selection
//   if (!selectedBank || !selectedBank?.id) {
//     Toast.show({
//       type: "error",
//       text1: "Bank selection is required",
//       visibilityTime: 3000,
//     });
//     return;
//   }

//   // Validate branch
//   if (!branch) {
//     Toast.show({
//       type: "error",
//       text1: "Branch is required",
//       visibilityTime: 3000,
//     });
//     return;
//   }

  if (true) {
    try {
      createUserBankMutation({
        variables: {
          bank_account: accNo,
          account_name: name,
          bank_id: selectedBank.id,
          branch_name: branch,
          is_primary: mainToggle,
        },
        onCompleted: (infoData) => {
          return { sucess: true, data: infoData, error: false };
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message }) => {
              console.log(message);
              return { sucess: false, data: message, error: "graphQL" };
            });
          }
          if (networkError) {
            console.log(networkError);
            return { sucess: false, data: networkError, error: "network" };
          }
        },
      });
    } catch (err) {
      console.log("functionerror, ", err);
      return { sucess: false, data: err, error: "function" };
    }
  }
};
