import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication optional (no auto-redirect to login)
export const base44 = createClient({
  appId: "68a512aeaa9d72dd49476d70", 
  requiresAuth: false
});
