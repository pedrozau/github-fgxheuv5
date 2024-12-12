export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid login credentials',
  EXPIRED_SESSION: 'JWT expired',
  NETWORK_ERROR: 'NetworkError',
  TOKEN_REFRESH_FAILED: 'Token refresh failed',
} as const;

export function getAuthErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro desconhecido';

  const errorMessage = error.message || error.error_description || error.toString();

  switch (errorMessage) {
    case AUTH_ERRORS.INVALID_CREDENTIALS:
      return 'Email ou senha incorretos';
    case AUTH_ERRORS.EXPIRED_SESSION:
      return 'Sua sessão expirou. Por favor, faça login novamente';
    case AUTH_ERRORS.NETWORK_ERROR:
      return 'Erro de conexão. Verifique sua internet';
    case AUTH_ERRORS.TOKEN_REFRESH_FAILED:
      return 'Erro ao renovar sessão. Por favor, faça login novamente';
    default:
      return 'Ocorreu um erro. Por favor, tente novamente';
  }
}