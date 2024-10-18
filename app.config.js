const IS_DEV = process.env.APP_VARIANT === 'development';

export default{
  "expo": {
    "name": IS_DEV ? "EWallet_Dev" : "88-mobile-project-rn" ,
    // "slug": "88-mobile-project-rn",
    "slug": "81-pay-2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/temp_icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? 'com.myapp.dev' : 'com.myapp',
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "testing.c",
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA"
      ],
      package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "Pick Image"
        }
      ],
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ],
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "project": "react-native",
          "organization": "netdb"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        // "projectId": "42f9c815-8aa2-401b-b069-8274ffe64cc8"
        "projectId": "ce3d0d81-d6ab-4fce-a610-8ca11f449ebc"
      }
    }
  }
}
