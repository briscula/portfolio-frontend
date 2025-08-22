import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async function handler(req: NextRequest) {
    try {
        const session = await getSession(req, NextResponse.next());

        if (!session?.user) {
            return NextResponse.json({ error: 'No user session' }, { status: 401 });
        }

        // Check if we have a refresh token in the session
        const refreshToken = session.refreshToken;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token available. User needs to re-login with offline_access scope.' },
                { status: 400 }
            );
        }

        // Use refresh token to get a new access token
        const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.AUTH0_CLIENT_ID!,
                client_secret: process.env.AUTH0_CLIENT_SECRET!,
                refresh_token: refreshToken,
                audience: process.env.AUTH0_AUDIENCE!,
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('Auth0 token error:', error);
            return NextResponse.json(
                { error: 'Failed to get token from Auth0', details: error },
                { status: tokenResponse.status }
            );
        }

        const tokenData = await tokenResponse.json();

        // Decode token header to check format
        let tokenInfo = null;
        if (tokenData.access_token) {
            try {
                const parts = tokenData.access_token.split('.');
                if (parts.length >= 1) {
                    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
                    tokenInfo = {
                        algorithm: header.alg,
                        type: header.typ,
                        isJWT: parts.length === 3,
                        isJWE: parts.length === 5
                    };
                }
            } catch (decodeError) {
                console.error('Error decoding token header:', decodeError);
            }
        }

        return NextResponse.json({
            accessToken: tokenData.access_token,
            tokenType: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            scope: tokenData.scope,
            tokenInfo,
            method: 'direct_auth0_call'
        });

    } catch (error) {
        console.error('Error getting direct token:', error);
        return NextResponse.json(
            {
                error: 'Failed to get direct access token',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
});