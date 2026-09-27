/**
 * MAISON SUCRE — CONFIGURATION
 * Supabase Project Keys & Environment Settings
 */

const CONFIG = {
  // Supabase Configuration
  // Configured with your Supabase Project
  SUPABASE_URL: localStorage.getItem('MS_SUPABASE_URL') || 'https://gouwmxzicctxaqghhqhi.supabase.co',
  SUPABASE_ANON_KEY: localStorage.getItem('MS_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXdteHppY2N0eGFxZ2hocWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTU3NjAsImV4cCI6MjEwNjA5MTc2MH0.29INPQHRMSPkOgNJ5W0CRlxBvtnDJBvWbpjsNFbn9wI',

  // Admin Master Passkey (for presentation and demonstration access)
  ADMIN_PASSKEY: 'maison2026',
  
  // Studio Business Settings
  CURRENCY: '$',
  TAX_RATE: 0.08, // 8% sales tax
  DELIVERY_FEE: 25.00,
  FREE_DELIVERY_THRESHOLD: 250.00,
  MIN_LEAD_TIME_HOURS: 48, // 48-hour notice required for artisanal cakes

  // Storage Keys
  STORAGE_CART_KEY: 'maison_sucre_cart',
  STORAGE_ADMIN_SESSION: 'maison_sucre_admin_session',
  STORAGE_MOCK_DB: 'maison_sucre_db'
};

// Export configuration globally
window.APP_CONFIG = CONFIG;
