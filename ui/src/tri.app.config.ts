import { TRIAppConfig } from '@toyota-research-institute/rse-react-library';

export default {
  name: 'Garden App',
  AWSConfig: {
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_upJgM8B3Y',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '78ac4a0mqe1l7f5qrmu1pkek2b',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true,

      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code',
      /*
          // OPTIONAL - Configuration for cookie storage
          // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
          cookieStorage: {
              // REQUIRED - Cookie domain (only required if cookieStorage is provided)
              domain: '.yourdomain.com',
              // OPTIONAL - Cookie path
              path: '/',
              // OPTIONAL - Cookie expiration in days
              expires: 365,
              // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
              sameSite: 'lax',
              // OPTIONAL - Cookie secure flag
              // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
              secure: true
          },
          // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
          authenticationFlowType: 'USER_PASSWORD_AUTH',
          // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
          clientMetadata: { myCustomKey: 'myCustomValue' },
          // OPTIONAL - Hosted UI configuration
          */
      oauth: {
        domain: 'dna-example-app.auth.us-east-1.amazoncognito.com',
        scope: ['email', 'openid'],
        redirectSignIn: 'http://localhost:3000',
        redirectSignOut: 'http://localhost:3000',
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
      }
    }
  },
  // base url prepend for all api calls
  apiBaseUrl: window.location.origin,
  // boolean flag to set amplify on/off for user authentication support
  amplifyEnabled: false,
  // OPTIONAL: URL to post feedback to JIRA
  issueCollectorUrl:
    'https://toyotaresearchinstitute.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/tod1zk/b/5/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=784fa038'
} as TRIAppConfig;
