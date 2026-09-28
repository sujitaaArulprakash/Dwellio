/**
 * Firebase ID Token verification utility for Dwellio server.
 * Uses Google Identity Toolkit REST API to securely verify tokens
 * against the Dwellio Firebase project without requiring private service account keys.
 */

const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('No Firebase ID token provided');
  }

  const apiKey = process.env.FIREBASE_API_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || 'dwellio-fd57e';

  if (!apiKey) {
    throw new Error('FIREBASE_API_KEY is not defined in server environment variables');
  }

  const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

  const response = await fetch(lookupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();

  if (!response.ok || !data.users || data.users.length === 0) {
    const errorMsg = data?.error?.message || 'Invalid or expired Firebase ID token';
    throw new Error(errorMsg);
  }

  const fbUser = data.users[0];
  const providerId = fbUser.providerUserInfo?.[0]?.providerId || 'firebase';

  return {
    uid: fbUser.localId,
    email: (fbUser.email || '').toLowerCase(),
    name: fbUser.displayName || '',
    profileImage: fbUser.photoUrl || '',
    emailVerified: !!fbUser.emailVerified,
    providerId: providerId.includes('google') ? 'google' : 'firebase',
  };
};

module.exports = {
  verifyFirebaseIdToken,
};
