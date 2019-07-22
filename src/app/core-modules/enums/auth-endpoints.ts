export enum AuthEndpoints {
  Login = '/auth/login/',
  Verify = '/auth/verify/',
  Register = '/users/',
  RefreshToken = '/auth/refresh/',
  ActivateAccount = '/users/activate/',
  ResendActivation = '/users/resend-activation/',
  ForgotPassword = '/users/forgot-password/',
  ResetPassword = '/users/reset-password/',
}

export enum ApiEndpoint {
  CurrentUser = '/users/current/',
  Addresses = '/addresses/',
  Offer = '/offers/',
  AnonymousOffer = '/offers/token/'
}
