/**
 * API Error Handler Utility
 * Provides helper functions for handling API errors consistently
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Extracts user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  // Check for axios error response
  if (error.response) {
    // Server responded with error status
    if (error.response.data?.message) {
      return error.response.data.message;
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 400:
        return 'Dados inválidos. Verifique os campos e tente novamente.';
      case 401:
        return 'Sessão expirada. Por favor, faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Este registro já existe.';
      case 500:
        return 'Erro no servidor. Tente novamente mais tarde.';
      default:
        return `Erro: ${error.response.status}`;
    }
  }

  // Check for axios error request
  if (error.request) {
    // Request was made but no response
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }

  // Something else happened
  if (error.message) {
    return error.message;
  }

  return 'Erro desconhecido. Tente novamente.';
}

/**
 * Creates a structured ApiError object
 */
export function createApiError(error: any): ApiError {
  return {
    message: getErrorMessage(error),
    status: error.response?.status,
    code: error.response?.data?.code || error.code,
    details: error.response?.data
  };
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error.request && !error.response;
}

/**
 * Checks if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403;
}

/**
 * Checks if error is a validation error
 */
export function isValidationError(error: any): boolean {
  return error.response?.status === 400;
}

/**
 * Checks if error is a server error
 */
export function isServerError(error: any): boolean {
  return error.response?.status >= 500;
}

/**
 * Logs error details for debugging
 */
export function logError(error: any, context?: string): void {
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, {
    message: getErrorMessage(error),
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method
  });
}

/**
 * Handles API errors and throws a structured error
 */
export function handleApiError(error: any): never {
  const apiError = createApiError(error);
  logError(error);
  throw apiError;
}

