// services/errorService.js
import * as Sentry from "@sentry/react-native";

//custom error handler for function
export const handleError = (error, additionalInfo) => {
    
  try {
    // Log additional info to Sentry
    // const scope = new Sentry.Scope();

    // Sentry.withScope((scope) => {
    //   if (Object.keys(additionalInfo).length) {
    //     scope.setTag("component", additionalInfo?.component);
    //     scope.setTag("info", additionalInfo.info);
    //     //   console.log(scope);
    //   }
    //   scope.setUser({
    //     name:'topmu'
    //   })

    //   Sentry.captureException(error);
    //   console.log('ngeng');
    // });

    // if (Object.keys(additionalInfo).length) {
    //   Sentry.setTag("component", additionalInfo?.component);
    //   Sentry.setTag("info", additionalInfo.info);
    //   //   console.log(scope);
    // }
    // Sentry.setTag("component", additionalInfo?.component);
    // Sentry.setTag("info", additionalInfo.info);

    Sentry.captureException(error);

    console.error("Error handled and reported:", error, additionalInfo);
  } catch (error) {
    console.error("Failed to handle or report the error:", error);
  }
};
