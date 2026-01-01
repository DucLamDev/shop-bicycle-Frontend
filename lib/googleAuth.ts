/**
 * Google OAuth Configuration and Helper Functions
 * 
 * Setup Instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Add authorized JavaScript origins: http://localhost:3000, your-production-domain
 * 6. Add authorized redirect URIs
 * 7. Copy Client ID to .env as NEXT_PUBLIC_GOOGLE_CLIENT_ID
 */

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Load Google Sign-In script
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.body.appendChild(script);
  });
};

/**
 * Initialize Google Sign-In
 */
export const initializeGoogleSignIn = async (
  onSuccess: (user: GoogleUser) => void,
  onError: (error: any) => void
) => {
  try {
    await loadGoogleScript();

    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID not configured');
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        try {
          const credential = parseJwt(response.credential);
          const user: GoogleUser = {
            googleId: credential.sub,
            email: credential.email,
            name: credential.name,
            avatar: credential.picture
          };
          onSuccess(user);
        } catch (error) {
          onError(error);
        }
      }
    });
  } catch (error) {
    onError(error);
  }
};

/**
 * Show Google One Tap prompt
 */
export const showGoogleOneTap = () => {
  if (window.google) {
    window.google.accounts.id.prompt();
  }
};

/**
 * Render Google Sign-In button
 */
export const renderGoogleButton = (elementId: string, options?: any) => {
  if (window.google) {
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        ...options
      }
    );
  }
};

/**
 * Parse JWT token
 */
const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

/**
 * Sign out from Google
 */
export const googleSignOut = () => {
  if (window.google) {
    window.google.accounts.id.disableAutoSelect();
  }
};
