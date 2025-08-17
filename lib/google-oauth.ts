// Google OAuth integration utility
// This provides examples of how to integrate with Google OAuth

export interface GoogleOAuthConfig {
  clientId: string
  redirectUri: string
  scope: string[]
}

export interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
  scope: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

class GoogleOAuthService {
  private config: GoogleOAuthConfig

  constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`,
      scope: ['openid', 'email', 'profile']
    }
  }

  // Generate Google OAuth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token'
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirectUri
    })

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`)
      }

      const tokens = await response.json() as GoogleTokenResponse
      return tokens
    } catch (error) {
      console.error('Google token exchange failed:', error)
      throw error
    }
  }

  // Get user info from Google
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo'
    
    try {
      const response = await fetch(userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`)
      }

      const userInfo = await response.json() as GoogleUserInfo
      return userInfo
    } catch (error) {
      console.error('Failed to get Google user info:', error)
      throw error
    }
  }

  // Verify ID token (optional - for additional security)
  async verifyIdToken(idToken: string): Promise<any> {
    const verifyEndpoint = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    
    try {
      const response = await fetch(verifyEndpoint)
      
      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.statusText}`)
      }

      const tokenInfo = await response.json()
      
      // Verify the token is for our client
      if (tokenInfo.aud !== this.config.clientId) {
        throw new Error('Token verification failed: Invalid audience')
      }

      return tokenInfo
    } catch (error) {
      console.error('Google ID token verification failed:', error)
      throw error
    }
  }

  // Revoke tokens (for logout)
  async revokeTokens(accessToken: string): Promise<void> {
    const revokeEndpoint = `https://oauth2.googleapis.com/revoke?token=${accessToken}`
    
    try {
      const response = await fetch(revokeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })

      if (!response.ok) {
        console.warn('Token revocation failed, but continuing with logout')
      }
    } catch (error) {
      console.warn('Token revocation failed:', error)
    }
  }

  // Initialize Google OAuth (for popup or redirect flow)
  initializeOAuth(): void {
    if (typeof window === 'undefined') return

    // This would typically load the Google OAuth library
    // For now, we'll provide a manual implementation
    console.log('Google OAuth initialization would happen here')
    console.log('Auth URL:', this.getAuthUrl())
  }

  // Handle OAuth popup (example implementation)
  async loginWithPopup(): Promise<GoogleTokenResponse> {
    if (typeof window === 'undefined') {
      throw new Error('Popup login only available in browser')
    }

    const authUrl = this.getAuthUrl()
    
    return new Promise((resolve, reject) => {
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      if (!popup) {
        reject(new Error('Failed to open popup window'))
        return
      }

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          window.removeEventListener('message', messageListener)
          popup.close()
          resolve(event.data.tokens)
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          window.removeEventListener('message', messageListener)
          popup.close()
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener('message', messageListener)

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', messageListener)
          reject(new Error('OAuth popup was closed'))
        }
      }, 1000)
    })
  }
}

export const googleOAuthService = new GoogleOAuthService()