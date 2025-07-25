
export const inputValidation = {
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  validateEmail(email: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeInput(email);
    
    if (!sanitized) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (sanitized.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    return { isValid: true };
  },

  validatePhone(phone: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeInput(phone);
    
    if (!sanitized) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    if (sanitized.length > 20) {
      return { isValid: false, error: 'Phone number is too long' };
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }
    
    return { isValid: true };
  },

  validateName(name: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeInput(name);
    
    if (!sanitized) {
      return { isValid: false, error: 'Name is required' };
    }
    
    if (sanitized.length > 100) {
      return { isValid: false, error: 'Name is too long' };
    }
    
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Name is too short' };
    }
    
    return { isValid: true };
  },

  validateAddress(address: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeInput(address);
    
    if (!sanitized) {
      return { isValid: false, error: 'Address is required' };
    }
    
    if (sanitized.length > 255) {
      return { isValid: false, error: 'Address is too long' };
    }
    
    return { isValid: true };
  },

  validateZipCode(zipCode: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeInput(zipCode);
    
    if (!sanitized) {
      return { isValid: false, error: 'ZIP code is required' };
    }
    
    if (sanitized.length > 10) {
      return { isValid: false, error: 'ZIP code is too long' };
    }
    
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid ZIP code format' };
    }
    
    return { isValid: true };
  }
};
