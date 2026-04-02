export interface PasswordRequest {
  length: number;
  include_symbols: boolean;
  include_numbers: boolean;
}

export interface PasswordResponse {
  password: string;
  strength_score: number;
}
