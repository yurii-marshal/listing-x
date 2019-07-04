export enum ApiEndpoint {
  Login = '/auth/login/',
  Verify = '/auth/verify/',
  Register = '/users/',
  RefreshToken = '/auth/refresh/',
  ActivateAccount = '/users/activate/',
  ResendActivation = '/users/resend-activation/',
  ForgotPassword = '/users/forgot-password/',
  Unknown = '/unknown'
}
