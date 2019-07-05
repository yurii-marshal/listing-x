export enum AuthEndpoints {
  Login = '/auth/login/',
  Verify = '/auth/verify/',
  Register = '/users/',
  RefreshToken = '/auth/refresh/',
  ActivateAccount = '/users/activate/',
  ResendActivation = '/users/resend-activation/',
  ForgotPassword = '/users/forgot-password/',
  ResetPassword = '/users/reset-password/',
  Unknown = '/unknown'
}

export enum ApiEndpoint {
  CurrentUser = '/users/current/'
}
