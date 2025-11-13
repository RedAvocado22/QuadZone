// ----------------------------------------------------------------------
// API Configuration - Mock Mode Toggle
// ----------------------------------------------------------------------
// Set VITE_USE_MOCK_DATA=true in .env file to enable mock data
// Set VITE_USE_MOCK_DATA=false or remove it to use real API

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.VITE_USE_MOCK_DATA === 'True';

// Log current mode (only in development)
if (import.meta.env.DEV) {
  console.log(`🔧 API Mode: ${USE_MOCK_DATA ? '📦 MOCK DATA' : '🌐 REAL API'}`);
  if (USE_MOCK_DATA) {
    console.log('ℹ️  All API calls are using mock data. Set VITE_USE_MOCK_DATA=false to use real API.');
  }
}

