import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      response_type: 'code',
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email offline_access'
    }
  })
});

export const POST = GET;