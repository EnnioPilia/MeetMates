export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  token: string;
  newPassword: string;
}
