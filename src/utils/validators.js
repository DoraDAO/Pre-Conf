/**
 * Utility functions for input validation and error handling
 */

/**
 * Validates if a value is not null or undefined
 * @param {*} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required`);
  }
  return true;
};

/**
 * Validates if a string is not empty
 * @param {string} value - The string to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validateNonEmptyString = (value, fieldName = 'Field') => {
  validateRequired(value, fieldName);
  
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  return true;
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validateEmail = (email) => {
  validateNonEmptyString(email, 'Email');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return true;
};

/**
 * Validates if a value is a positive number
 * @param {number} value - The number to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validatePositiveNumber = (value, fieldName = 'Value') => {
  validateRequired(value, fieldName);
  
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (value <= 0) {
    throw new Error(`${fieldName} must be positive`);
  }
  
  return true;
};

/**
 * Safely executes an async function with error handling
 * @param {Function} asyncFn - The async function to execute
 * @param {string} context - Context for error messages
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const safeAsync = async (asyncFn, context = 'Operation') => {
  try {
    const result = await asyncFn();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Validates an array is not empty
 * @param {Array} arr - The array to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} - True if valid
 * @throws {Error} - If validation fails
 */
export const validateNonEmptyArray = (arr, fieldName = 'Array') => {
  validateRequired(arr, fieldName);
  
  if (!Array.isArray(arr)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  if (arr.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  return true;
};
