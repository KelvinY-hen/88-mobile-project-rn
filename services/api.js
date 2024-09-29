

export const useMutationAPI = async (mutations, variable) => {
    let success = false;
    let data = null;
    let error = 'none';
    let message = null;
  try {
    console.log('jalan mutation');
    await mutations({
      variables: variable,
      onCompleted: (infoData) => {
        console.log(infoData);
        // return infoData.createUserBank;
        success = true;
        data =  infoData;
      },
      onError: ({ graphQLErrors, networkError }) => {

        console.log('msukerror')

        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            // alert("Registration failed. Please try again. /n" + message);
            data = graphQLErrors;
            error =  'graphql';
          });
        }
        if (networkError) {
          console.log(networkError);
          data = networkError;
          error =  'network';
        }

      },
    });

    return { success: success, data: data, error: error };
    // console.log("Bank Added successfully!");
  } catch (err) {
    console.log("functionerror, ", err);
    return { success: false, data: err, error: "function" };
  } finally {

  }
};
