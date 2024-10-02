// import * as Sentry from '@sentry/react-native';
import Toast from 'react-native-toast-message';// Example if you're sending errors to Telegram

// General error handling function
export const handleError = (errorType, errorData = {}, additionalInfo = {}) => {
  // Optional: Log the error in Sentry or other error tracking service
//   if (errorData) {
//     if(additionalInfo){
//         Sentry.captureException(errorData, {
//             tags: additionalInfo
//           });
//     }else{
//         Sentry.captureException(errorData);
//     }
//   }
  
  switch (errorType) {
    case 'graphql':
      console.error('GraphQL Error:', errorData);
      Toast.show({
        type: 'error',
        text1: 'GraphQL Error',
        text2: 'API Request failed. Please try again later.',
        visibilityTime: 3000,
      });
      break;
      
    case 'network':
      console.error('Network Error:', errorData);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Network error. Please try again later.',
        visibilityTime: 3000,
      });
      break;
      
    case 'function':
      console.error('Function Error:', errorData);
      Toast.show({
        type: 'error',
        text1: 'Function Error',
        text2: 'An error occurred. Please try again later.',
        visibilityTime: 3000,
      });
      break;
      
    default:
      console.error('Unknown Error:', errorData);
      Toast.show({
        type: 'error',
        text1: 'Unknown Error',
        text2: 'An unknown error occurred. Please try again later.',
        visibilityTime: 3000,
      });
      break;
  }

};
