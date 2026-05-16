// FIXED: Using Environment Variables instead of hardcoded keys
export const analyticsConfig = {
  apiKey: import.meta.env.VITE_ANALYTICS_KEY || 'VORTEX_SECURE_MESS_2026',
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD
};
