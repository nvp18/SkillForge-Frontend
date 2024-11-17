// src/config.js
const config = {
    API_BASE_URL: import.meta.env.SPRING_API_BASE_URL,
    ENV: import.meta.env.MODE || 'development',  // Provides current mode ('development' or 'production')
  };
  
  export default config;
  