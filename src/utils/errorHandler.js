/**
 * Centralized error handling utilities
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  VALIDATION: 'VALIDATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  DATABASE: 'DATABASE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, details = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Logs error with context
 * @param {Error} error - The error to log
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  const errorInfo = {
    message: error.message,
    type: error.type || ErrorTypes.UNKNOWN,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack
  };
  
  console.error('Application Error:', errorInfo);
  
  // In production, you might want to send this to an error tracking service
  // Example: sendToErrorTracker(errorInfo);
};

/**
 * Creates a user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} - User-friendly message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorTypes.VALIDATION:
        return error.message;
      case ErrorTypes.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorTypes.AUTH:
        return 'Authentication failed. Please log in again.';
      case ErrorTypes.DATABASE:
        return 'Database error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  return error.message || 'An unexpected error occurred.';
};

/**
 * Error boundary wrapper for async operations
 * @param {Function} fn - Function to wrap
 * @param {string} context - Context for error logging
 * @returns {Function} - Wrapped function
 */
export const withErrorBoundary = (fn, context) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      throw error;
    }
  };
};
