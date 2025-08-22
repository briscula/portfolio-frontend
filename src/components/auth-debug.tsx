'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

export default function AuthDebug() {
  const { user, isLoading } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const fetchAccessToken = async () => {
    try {
      setTokenError(null);
      const response = await fetch('/api/auth/token');
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
      } else {
        setTokenError('Failed to fetch access token');
      }
    } catch (error) {
      setTokenError('Error fetching access token: ' + (error as Error).message);
    }
  };

  if (isLoading) return <div>Loading auth debug...</div>;

  if (!user) return <div>Not authenticated</div>;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Auth0 Debug Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">User Object:</h4>
          <pre className="bg-white p-2 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium">Access Token Test:</h4>
          <button
            onClick={fetchAccessToken}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Access Token
          </button>
          
          {accessToken && (
            <div className="mt-2">
              <p className="text-green-600">Access Token Retrieved:</p>
              <pre className="bg-white p-2 rounded text-xs overflow-auto">
                {accessToken}
              </pre>
            </div>
          )}
          
          {tokenError && (
            <div className="mt-2">
              <p className="text-red-600">Error:</p>
              <p className="text-sm">{tokenError}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium">Available User Properties:</h4>
          <ul className="text-sm">
            <li>• sub (User ID): {user.sub}</li>
            <li>• email: {user.email}</li>
            <li>• name: {user.name}</li>
            <li>• picture: {user.picture}</li>
            <li>• email_verified: {user.email_verified?.toString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}