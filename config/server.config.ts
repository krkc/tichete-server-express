const env = process.env;
export default {
  'appName': env.APP_NAME || 'myApp',
  'port': env.PORT || env.APP_PORT || 3000,
  'sessionSecret': env.APP_SESSION_SECRET || 'session-secret',
  'auth': {
    'secret': env.APP_JWT_SECRET || 'jwt-secret',
    'allowedPaths': [
        '/auth/register',
        '/auth/login'
    ],
    'jwtSignOptions': {
      'algorithm': 'HS256',
      'expiresIn': 120
    }
  }
}
