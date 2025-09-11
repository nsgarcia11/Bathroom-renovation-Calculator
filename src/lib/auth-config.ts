/**
 * Authentication configuration utilities
 * Handles different environments (local, staging, production)
 */

export function getAuthRedirectUrl(path: string = '/auth/callback'): string {
  // In client-side code, use window.location.origin
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }

  // In server-side code, use environment variable
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function getAuthCallbackUrl(): string {
  return getAuthRedirectUrl('/auth/callback');
}

export function getAuthCallbackHandlerUrl(): string {
  return getAuthRedirectUrl('/auth/callback-handler');
}

/**
 * Get the appropriate redirect URL based on environment
 * This is useful for server-side operations
 */
export function getServerAuthRedirectUrl(
  path: string = '/auth/callback'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

/**
 * Environment detection utilities
 */
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isLocal =
  typeof window !== 'undefined' && window.location.hostname === 'localhost';
