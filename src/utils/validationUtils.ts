/**
 * Comprehensive validation utilities for network calculator inputs
 * Provides user-friendly error messages and real-time validation
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates IPv4 address format and range
 * @param ip - IP address string to validate
 * @returns ValidationResult with error message if invalid
 */
export const validateIPv4 = (ip: string): ValidationResult => {
  if (!ip || ip.trim() === '') {
    return { valid: false, error: "IP address is required" };
  }

  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipRegex);

  if (!match) {
    return { 
      valid: false, 
      error: "Invalid IP format. Use xxx.xxx.xxx.xxx (e.g., 192.168.1.0)" 
    };
  }

  const octets = [match[1], match[2], match[3], match[4]].map(Number);
  
  for (let i = 0; i < octets.length; i++) {
    if (octets[i] < 0 || octets[i] > 255) {
      return { 
        valid: false, 
        error: `Octet ${i + 1} must be between 0 and 255 (got ${octets[i]})` 
      };
    }
  }

  return { valid: true };
};

/**
 * Validates CIDR notation (subnet mask)
 * @param cidr - CIDR value (8-32)
 * @returns ValidationResult with error message if invalid
 */
export const validateCIDR = (cidr: string | number): ValidationResult => {
  const cidrNum = typeof cidr === 'string' ? parseInt(cidr) : cidr;

  if (isNaN(cidrNum)) {
    return { valid: false, error: "CIDR must be a valid number" };
  }

  if (cidrNum < 8 || cidrNum > 32) {
    return { 
      valid: false, 
      error: "CIDR must be between /8 and /32" 
    };
  }

  return { valid: true };
};

/**
 * Validates positive number input
 * @param value - String value to validate
 * @param fieldName - Name of field for error messages
 * @param options - Optional min/max constraints
 * @returns ValidationResult with error message if invalid
 */
export const validatePositiveNumber = (
  value: string, 
  fieldName: string,
  options?: { min?: number; max?: number }
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }

  if (num < 0) {
    return { valid: false, error: `${fieldName} must be positive` };
  }

  if (options?.min !== undefined && num < options.min) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least ${options.min}` 
    };
  }

  if (options?.max !== undefined && num > options.max) {
    return { 
      valid: false, 
      error: `${fieldName} must not exceed ${options.max}` 
    };
  }

  return { valid: true };
};

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns ValidationResult with error message if invalid
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { 
      valid: false, 
      error: "Invalid email format (e.g., user@example.com)" 
    };
  }

  if (email.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }

  return { valid: true };
};

/**
 * Validates string length
 * @param value - String to validate
 * @param fieldName - Name of field for error messages
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns ValidationResult with error message if invalid
 */
export const validateStringLength = (
  value: string,
  fieldName: string,
  min: number,
  max: number
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  const trimmed = value.trim();

  if (trimmed.length < min) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least ${min} characters` 
    };
  }

  if (trimmed.length > max) {
    return { 
      valid: false, 
      error: `${fieldName} must not exceed ${max} characters` 
    };
  }

  return { valid: true };
};

/**
 * Logs error to console and analytics
 * @param context - Context where error occurred
 * @param error - Error object or message
 */
export const logError = (context: string, error: any) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, {
    message: errorMessage,
    timestamp: new Date().toISOString(),
    stack: error instanceof Error ? error.stack : undefined
  });
  
  // Track error in analytics if available
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('error_occurred', {
      context,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};
