export enum ApiEndpoint {
  CurrentUser = '/users/current/',
  Addresses = '/addresses/',
  Offer = '/offers/',
  AnonymousOffer = '/offers/token/',
  Upload = '/documents/upload/',
  Transactions = '/transactions/',
  Calendar = '/transactions/calendar/',
  TransactionCalendar = '/transactions/{id}/calendar/',
  Sign = '/e-document/',
  LockOffer = '/transactions/{id}/esignatures/',
  InviteUser =  '/transactions/{id}/invite/',
  ESignature = '/transactions/{id}/esignatures/',
  Deny = '/transactions/{id}/deny/'
}

export enum AuthEndpoint {
  Login = '/auth/login/',
  Verify = '/auth/verify/',
  Register = '/users/',
  RefreshToken = '/auth/refresh/',
  ActivateAccount = '/users/activate/',
  ResendActivation = '/users/resend-activation/',
  ForgotPassword = '/users/forgot-password/',
  ResetPassword = '/users/reset-password/',
}

