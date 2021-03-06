export enum ApiEndpoint {
  CurrentUser = '/users/current/',
  Addresses = '/addresses/',
  Offer = '/offers/',
  CounterOffer = '/counter_offers/',
  AnonymousOffer = '/offers/token/',
  Upload = '/documents/upload/',
  Agreements = '/agreements/',
  Transactions = '/transactions/',
  Calendar = '/transactions/calendar/',
  TransactionCalendar = '/transactions/{id}/calendar/',
  Sign = '/e-document/',
  LockOffer = '/transactions/{id}/esignatures/',
  InviteUser =  '/transactions/{id}/invite/',
  // ESignature = '/transactions/{id}/esignatures/',
  ESignature = '/e-document/{id}/',
  ESignatureSPQ = '/e-document/spq/{id}/',
  CreateAddendum = '/e-document/addendum/create/{id}/',
  Addendum = '/e-document/addendum/{id}/',
  Deny = '/transactions/{id}/deny/',
  ToggleState = '/transactions/{id}/pdf/',
  CompleteRegistration = '/user/complete-registration/',
  AgentProfile = '/users/agent-profile',
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
