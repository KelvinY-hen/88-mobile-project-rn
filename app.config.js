const IS_DEV = process.env.APP_VARIANT === 'development';

export default{
  "expo": {
    "name": IS_DEV ? "EWallet_Dev" : "88-mobile-project-rn" ,
    "slug": "88-mobile-project-rn",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/temp_icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/ai_splash.png",
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
        "@sentry/react-native/expo",
        {
          "organization": "sentry org slug, or use the `SENTRY_ORG` environment variable",
          "project": "sentry project name, or use the `SENTRY_PROJECT` environment variable",
          // If you are using a self-hosted instance, update the value of the url property
          // to point towards your self-hosted instance. For example, https://self-hosted.example.com/.
          "url": "https://sentry.io/"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "42f9c815-8aa2-401b-b069-8274ffe64cc8"
      }
    }
  }
}
