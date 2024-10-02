import { useMutation } from "@apollo/client";


// export const useMutationAPI = async (query, variable) => {
//     let success = false;
//     let data = null;
//     let error = 'none';
//     let message = null;
//     const [mutations] = useMutation(query);

//     try {
//     await mutations({
//       variables: variable,
//       onCompleted: (infoData) => {
//         console.log(infoData);
//         // return infoData.createUserBank;
//         success = true;
//         data =  infoData;
//       },
//       onError: ({ graphQLErrors, networkError }) => {


//         if (graphQLErrors) {
//           graphQLErrors.forEach(({ message, locations, path }) => {
//             // alert("Registration failed. Please try again. /n" + message);
//             data = graphQLErrors;
//             error =  'graphql';
//           });
//         }
//         if (networkError) {
//           console.log(networkError);
//           data = networkError;
//           error =  'network';
//         }

//       },
//     });

//     return { success: success, data: data, error: error };
//     // console.log("Bank Added successfully!");
//   } catch (err) {
//     console.log("functionerror, ", err);
//     return { success: false, data: err, error: "function" };
//   } finally {

//   }
// };

// Custom hook for handling mutations
export const useMutationAPI = (query) => {
  const [mutateFunction, { data, error, loading }] = useMutation(query);

  const handleMutation = async (variables) => {
    try {
      const result = await mutateFunction({
        variables: variables,
      });

      // Handle the result here
      return { success: true, data: result.data, error: null };
    } catch (err) {
      // Check for GraphQL or network errors
      if (err.graphQLErrors) {
        return { success: false, data: err.graphQLErrors, error: 'graphql' };
      }
      if (err.networkError) {
        return { success: false, data: err.networkError, error: 'network' };
      }
      return { success: false, data: err, error: 'function' };
    }
  };

  return { handleMutation, data, error, loading };
};
